import {Buttes} from "./index";
import {createWriteStream, createReadStream} from "fs"
import {Transform} from "stream";

const pipe = new Buttes({chunkSize: 1024})


let output;

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function niceBytes(x: string){

    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }

    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

async function main() {
    const input = createReadStream(`${process.cwd()}/family.png`)
    const f = new Transform();
    let done;
    const isDone = new Promise(res => (done = res));

    pipe.consume(input).map({
        chunkStart: async (id) => {
            console.log("Chunk started", id)
            output = createWriteStream('./out/output-' + id + ".txt");
        },
        chunkEnd: async (id) => {
            console.log("chunk ended", id)
            output.end();
        },
        onData: (chunk, id, isLast) => {
            f.push(chunk)
            if (isLast) {
                done()
            }
        }
    })
    await isDone
    f.pipe(createWriteStream("./out/out.png"))
}
main()

/*
pipe.on('chunkStart', (id, done) => {
    console.log("Chunk started", id)
    output = createWriteStream('./output-' + id + ".txt");
    done();
});

pipe.on('chunkEnd', (id, done) => {
    console.log("chunk ended", id)
    output.end();
    done();
});

pipe.on('data', (chunk) => {
    console.log("DATA", chunk.data.length)
    output.write(chunk);
});


input.pipe(pipe);
 */