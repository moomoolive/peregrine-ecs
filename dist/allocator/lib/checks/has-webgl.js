"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasWebGL = void 0;
const hasWebGL = () => {
    try {
        document.createElement("canvas").getContext("webgl");
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.hasWebGL = hasWebGL;
