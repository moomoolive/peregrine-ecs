"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IEnableMixin = void 0;
const api_js_1 = require("../api.js");
const mixin_js_1 = require("../mixin.js");
/**
 * Mixin class decorator, injects IEnable default implementation, incl.
 * a `_enabled` property. If the target also implements the
 * {@link @thi.ng/api#INotify} interface, {@link IEnable.enable} and
 * {@link IEnable.disable} will automatically emit the respective
 * events.
 */
exports.IEnableMixin = (0, mixin_js_1.mixin)({
    _enabled: true,
    isEnabled() {
        return this._enabled;
    },
    enable() {
        $enable(this, true, api_js_1.EVENT_ENABLE);
    },
    disable() {
        $enable(this, false, api_js_1.EVENT_DISABLE);
    },
    toggle() {
        this._enabled ? this.disable() : this.enable();
        return this._enabled;
    },
});
const $enable = (target, state, id) => {
    target._enabled = state;
    if (target.notify) {
        target.notify({ id, target });
    }
};
