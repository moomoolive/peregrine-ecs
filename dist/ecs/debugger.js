"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const index_1 = require("../dataStructures/registries/index");
class Debugger {
    constructor(componentClasses, stringifiedComponentDeclaration) {
        this.componentClasses = componentClasses;
        this._stringifiedComponentDeclaration = stringifiedComponentDeclaration;
        this.componentDebugInfo = [];
        for (let i = 0; i < componentClasses.length; i++) {
            this.componentDebugInfo.push((0, index_1.debugComponent)(i, componentClasses));
        }
    }
    get componentCount() {
        return this.componentDebugInfo.length;
    }
    get stringifiedComponentDeclaration() {
        return this._stringifiedComponentDeclaration;
    }
    componentInfo(componentId) {
        return this.componentDebugInfo[componentId];
    }
    allComponents() {
        return this.componentDebugInfo;
    }
}
exports.Debugger = Debugger;
