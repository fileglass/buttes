import {Readable, Transform} from "stream";
import {Context, createChainedFunction} from "@reincarnatedjesus/f-chain"

interface Options {
    chunkSize: number,
}

interface State {
    lastEmittedChunk: number,
    bytesPassed: number,
    curr: number
}

export interface Ops {
    chunkStart: (id: number) => Promise<void>
    chunkEnd: (id: number) => Promise<void>
    onData: (chunk: Buffer, id: number) => any
}

function toThenable(f: Function, ...args: unknown[]) {
    return new Promise(async (res) => {
        res(await f(...args))
    })
}


export class Buttes extends Transform {
    private readonly state = new Map<keyof State, any>();
    private readonly handlers = new Map<string, (...args: any[]) => void>();

constructor(private readonly opts: Options) {
    super()
    this._setState("bytesPassed", 0)
    this._setState("curr", -1)

}

    private _getState<T extends keyof State>(key: T): State[T] {
    return this.state.get(key)
    }

    private _setState<T extends keyof State>(key: T, val: State[T]) {
    return this.state.set(key, val)
    }

    private _finishChunk() {
    return new Promise<void>((res) => {
        this.emit("chunkEnd", this._getState("curr"), () => {
            this._setState("bytesPassed", 0)
            this._setState("lastEmittedChunk", undefined)
            res()
        })
    })
    }

    private _startChunk() {
    return new Promise<void>(res => {
        this._setState("curr", this._getState("curr") + 1)
        this.emit("chunkStart", this._getState("curr"), res)
    })
    }

    private _push(buff: Buffer) {
        this.push(buff)
        this._setState("bytesPassed", this._getState("bytesPassed") + buff.length)
    }
    private async _startPush(buff: Buffer) {
    if (this._getState("lastEmittedChunk") !== this._getState("curr")) {
        await this._startChunk()
        this._setState("lastEmittedChunk", this._getState("curr"))
        this._push(buff)
    } else {
        this._push(buff)
    }
    }

    async _transform(chunk: Buffer, enc, cb) {
        const bLeft = Math.min(chunk.length, this.opts.chunkSize - this._getState("bytesPassed"))
        let remainder;
        if (this._getState("bytesPassed") + chunk.length < this.opts.chunkSize) {
            this._startPush(chunk)
            cb()
        } else {
            remainder = bLeft - chunk.length
            if (remainder === 0) {
                await this._startPush(chunk)
                await this._finishChunk()
                cb()
            } else {
                await this._startPush(chunk.slice(0, bLeft));
                chunk = chunk.slice(bLeft);
                await this._finishChunk();
                await this._transform(chunk, enc, cb)
            }
        }
    }

    /**
     * Pipes the class to the passed stream and returns a chain of methods that allow for consumption
     * @param stream
     */
    public consume(stream: Readable) {
        stream.pipe(this);
        const ch = createChainedFunction(() => this, {raw: (ctx: Context) => ctx.getRoot<Buttes>(), map})
        return ch()
    }

    public get __id() {
    return this._getState("curr")
    }
}


function map(ctx: Context, handlers: Ops) {
    const root = ctx.getRoot<Buttes>()
    root.on("chunkStart", (id, done) => toThenable(handlers.chunkStart, id).then(done))
    root.on("chunkEnd", (id, done) => toThenable(handlers.chunkEnd, id).then(done))
    root.on("data", (chunk) => handlers.onData(chunk, root.__id))
    return true
}

