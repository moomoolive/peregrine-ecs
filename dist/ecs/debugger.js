"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const index_1 = require("../dataStructures/registries/index");
class Debugger {
    constructor(self) {
        this["@self"] = self;
    }
    componentInfo(componentId) {
        return (0, index_1.debugComponent)(componentId, this["@self"]["componentClasses"]);
    }
}
exports.Debugger = Debugger;
