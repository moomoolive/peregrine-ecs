"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentDebugInfo = void 0;
const index_1 = require("../components/index");
function generateComponentDebugInfo(componentProxyStructClasses) {
    const componentDebugInfo = [];
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
        componentDebugInfo.push(componentInfo);
    }
    return componentDebugInfo;
}
exports.generateComponentDebugInfo = generateComponentDebugInfo;
