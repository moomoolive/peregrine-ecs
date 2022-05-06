"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const index_1 = require("../dataStructures/registries/index");
class Debugger {
    constructor(componentClasses) {
        this.componentClasses = componentClasses;
        this.componentCount = componentClasses.length;
    }
    componentInfo(componentId) {
        return (0, index_1.debugComponent)(componentId, this.componentClasses);
    }
    allComponents() {
        const componentsDebug = [];
        const len = this.componentClasses.length;
        for (let i = 0; i < len; i++) {
            const component = this.componentClasses[i];
            componentsDebug.push({
                id: i,
                definition: component.def,
                name: component.name,
                bytesPerElement: component.bytesPerElement
            });
        }
        return componentsDebug;
    }
}
exports.Debugger = Debugger;
