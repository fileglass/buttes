"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buttes = void 0;
var stream_1 = require("stream");
var f_chain_1 = require("@reincarnatedjesus/f-chain");
function toThenable(f) {
    var _this = this;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = res;
                    return [4 /*yield*/, f.apply(void 0, args)];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
}
var Buttes = /** @class */ (function (_super) {
    __extends(Buttes, _super);
    function Buttes(opts) {
        var _this = _super.call(this) || this;
        _this.opts = opts;
        _this.state = new Map();
        _this.handlers = new Map();
        _this.expectedChunkCount = 0;
        _this._setState("bytesPassed", 0);
        _this._setState("curr", -1);
        return _this;
    }
    Buttes.prototype._getState = function (key) {
        return this.state.get(key);
    };
    Buttes.prototype._setState = function (key, val) {
        return this.state.set(key, val);
    };
    Buttes.prototype._finishChunk = function () {
        var _this = this;
        return new Promise(function (res) {
            _this.emit("chunkEnd", _this._getState("curr"), function () {
                _this._setState("bytesPassed", 0);
                _this._setState("lastEmittedChunk", undefined);
                res();
            });
        });
    };
    Buttes.prototype._startChunk = function () {
        var _this = this;
        return new Promise(function (res) {
            _this._setState("curr", _this._getState("curr") + 1);
            _this.emit("chunkStart", _this._getState("curr"), res);
        });
    };
    Buttes.prototype._push = function (buff) {
        this.push(buff);
        this._setState("bytesPassed", this._getState("bytesPassed") + buff.length);
    };
    Buttes.prototype._startPush = function (buff) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._getState("lastEmittedChunk") !== this._getState("curr"))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._startChunk()];
                    case 1:
                        _a.sent();
                        this._setState("lastEmittedChunk", this._getState("curr"));
                        this._push(buff);
                        return [3 /*break*/, 3];
                    case 2:
                        this._push(buff);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Buttes.prototype._transform = function (chunk, enc, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var bLeft, remainder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bLeft = Math.min(chunk.length, this.opts.chunkSize - this._getState("bytesPassed"));
                        if (!(this._getState("bytesPassed") + chunk.length < this.opts.chunkSize)) return [3 /*break*/, 1];
                        this._startPush(chunk);
                        cb();
                        return [3 /*break*/, 8];
                    case 1:
                        remainder = bLeft - chunk.length;
                        if (!(remainder === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._startPush(chunk)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._finishChunk()];
                    case 3:
                        _a.sent();
                        cb();
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this._startPush(chunk.slice(0, bLeft))];
                    case 5:
                        _a.sent();
                        chunk = chunk.slice(bLeft);
                        return [4 /*yield*/, this._finishChunk()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this._transform(chunk, enc, cb)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Pipes the class to the passed stream and returns a chain of methods that allow for consumption
     * @param stream
     */
    Buttes.prototype.consume = function (stream) {
        var _this = this;
        stream.pipe(this);
        var ch = f_chain_1.createChainedFunction(function () { return _this; }, { raw: function (ctx) { return ctx.getRoot(); }, map: map });
        return ch();
    };
    Object.defineProperty(Buttes.prototype, "__id", {
        get: function () {
            return this._getState("curr");
        },
        enumerable: false,
        configurable: true
    });
    return Buttes;
}(stream_1.Transform));
exports.Buttes = Buttes;
function map(ctx, handlers) {
    var root = ctx.getRoot();
    root.on("chunkStart", function (id, done) { return toThenable(handlers.chunkStart, id).then(done); });
    root.on("chunkEnd", function (id, done) { return toThenable(handlers.chunkEnd, id).then(done); });
    root.on("data", function (chunk) {
        var isLast = chunk.byteLength < root.opts.chunkSize;
        handlers.onData(chunk, root.__id, isLast);
    });
    return true;
}
