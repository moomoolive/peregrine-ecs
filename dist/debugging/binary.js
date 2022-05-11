"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberBits = void 0;
function getNumberBits(n) {
    const bin = (n >>> 0).toString(2);
    let prettyBin = "";
    const len = bin.length;
    for (let i = 1; i < 33; i += 1) {
        const reverseIndex = len - i;
        let str = "";
        if (reverseIndex < 0) {
            str = "0";
        }
        else {
            str = bin[reverseIndex];
        }
        if (i % 4 === 0 && i !== 0 && i !== 32) {
            str = "_" + str;
        }
        prettyBin = str + prettyBin;
    }
    return prettyBin;
}
exports.getNumberBits = getNumberBits;
