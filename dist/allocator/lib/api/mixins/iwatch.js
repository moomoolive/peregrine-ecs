"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IWatchMixin = void 0;
const mixin_js_1 = require("../mixin.js");
exports.IWatchMixin = (0, mixin_js_1.mixin)({
    addWatch(id, fn) {
        this._watches = this._watches || {};
        if (this._watches[id]) {
            return false;
        }
        this._watches[id] = fn;
        return true;
    },
    removeWatch(id) {
        if (!this._watches)
            return;
        if (this._watches[id]) {
            delete this._watches[id];
            return true;
        }
        return false;
    },
    notifyWatches(oldState, newState) {
        if (!this._watches)
            return;
        const w = this._watches;
        for (let id in w) {
            w[id](id, oldState, newState);
        }
    },
});
