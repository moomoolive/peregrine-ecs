"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const index_1 = require("../dataStructures/registries/index");
class Debugger {
    constructor(componentProxyStructClasses, components) {
        const componentsCopy = JSON.parse(JSON.stringify(components));
        this.schemas = Object.freeze(componentsCopy);
        this.componentDebugInfo = [];
        for (let i = 0; i < componentProxyStructClasses.length; i++) {
            const { name, bytesPerElement, tokens, stringifiedDefinition, } = componentProxyStructClasses[i];
            const tokensCopy = JSON.parse(JSON.stringify(tokens));
            const componentInfo = {
                definition: tokensCopy,
                bytesPerElement,
                name,
                stringifiedDef: stringifiedDefinition,
                id: (0, index_1.computeComponentId)(i)
            };
            this.componentDebugInfo.push(componentInfo);
        }
    }
    get componentCount() {
        return this.componentDebugInfo.length;
    }
    componentInfo(componentId) {
        /* component ids are number under the hood, but
        the have the "or component declaration" component
        to allow for good intellisense in certain situations
        (such as querying, etc.) */
        const id = (componentId
            - 50 /* reserved_count */);
        return this.componentDebugInfo[id];
    }
    allComponents() {
        return this.componentDebugInfo;
    }
}
exports.Debugger = Debugger;
