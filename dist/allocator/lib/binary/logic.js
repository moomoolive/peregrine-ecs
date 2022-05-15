"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitDemuxM = exports.bitMuxM = exports.bitOai22M = exports.bitAoi22M = exports.bitOai21M = exports.bitAoi21M = exports.bitImplyM = exports.bitXnorM = exports.bitXorM = exports.bitNorM = exports.bitOrM = exports.bitNandM = exports.bitAndM = exports.bitNotM = exports.bitDemux = exports.bitMux = exports.bitOai22 = exports.bitAoi22 = exports.bitOai21 = exports.bitAoi21 = exports.bitImply = exports.bitXnor = exports.bitXor = exports.bitNor = exports.bitOr = exports.bitNand = exports.bitAnd = exports.bitNot = void 0;
const mask_js_1 = require("./mask.js");
const bitNot = (x) => ~x;
exports.bitNot = bitNot;
const bitAnd = (a, b) => a & b;
exports.bitAnd = bitAnd;
const bitNand = (a, b) => ~(a & b);
exports.bitNand = bitNand;
const bitOr = (a, b) => a | b;
exports.bitOr = bitOr;
const bitNor = (a, b) => ~(a | b);
exports.bitNor = bitNor;
const bitXor = (a, b) => a ^ b;
exports.bitXor = bitXor;
const bitXnor = (a, b) => ~(a ^ b);
exports.bitXnor = bitXnor;
const bitImply = (a, b) => ~a | b;
exports.bitImply = bitImply;
const bitAoi21 = (a, b, c) => ~(a | (b & c));
exports.bitAoi21 = bitAoi21;
const bitOai21 = (a, b, c) => ~(a & (b | c));
exports.bitOai21 = bitOai21;
const bitAoi22 = (a, b, c, d) => ~((a & b) | (c & d));
exports.bitAoi22 = bitAoi22;
const bitOai22 = (a, b, c, d) => ~((a | b) & (c | d));
exports.bitOai22 = bitOai22;
const bitMux = (a, b, s) => ((a & ~s) | (b & s)) >>> 0;
exports.bitMux = bitMux;
const bitDemux = (a, b, s) => [
    (a & ~s) >>> 0,
    (b & s) >>> 0,
];
exports.bitDemux = bitDemux;
const bitNotM = (n, x) => (0, mask_js_1.maskL)(n, ~x);
exports.bitNotM = bitNotM;
const bitAndM = (n, a, b) => (0, mask_js_1.maskL)(n, a & b);
exports.bitAndM = bitAndM;
const bitNandM = (n, a, b) => (0, mask_js_1.maskL)(n, ~(a & b));
exports.bitNandM = bitNandM;
const bitOrM = (n, a, b) => (0, mask_js_1.maskL)(n, a | b);
exports.bitOrM = bitOrM;
const bitNorM = (n, a, b) => (0, mask_js_1.maskL)(n, ~(a | b));
exports.bitNorM = bitNorM;
const bitXorM = (n, a, b) => (0, mask_js_1.maskL)(n, a ^ b);
exports.bitXorM = bitXorM;
const bitXnorM = (n, a, b) => (0, mask_js_1.maskL)(n, ~(a ^ b));
exports.bitXnorM = bitXnorM;
const bitImplyM = (n, a, b) => (0, mask_js_1.maskL)(n, ~a | b);
exports.bitImplyM = bitImplyM;
const bitAoi21M = (n, a, b, c) => (0, mask_js_1.maskL)(n, ~(a | (b & c)));
exports.bitAoi21M = bitAoi21M;
const bitOai21M = (n, a, b, c) => (0, mask_js_1.maskL)(n, ~(a & (b | c)));
exports.bitOai21M = bitOai21M;
const bitAoi22M = (n, a, b, c, d) => (0, mask_js_1.maskL)(n, ~((a & b) | (c & d)));
exports.bitAoi22M = bitAoi22M;
const bitOai22M = (n, a, b, c, d) => (0, mask_js_1.maskL)(n, ~((a | b) & (c | d)));
exports.bitOai22M = bitOai22M;
const bitMuxM = (n, a, b, s) => (0, mask_js_1.maskL)(n, (a & ~s) | (b & s));
exports.bitMuxM = bitMuxM;
const bitDemuxM = (n, a, b, s) => [
    (0, mask_js_1.maskL)(n, a & ~s),
    (0, mask_js_1.maskL)(n, b & s),
];
exports.bitDemuxM = bitDemuxM;
