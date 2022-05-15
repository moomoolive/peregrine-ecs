"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INotifyMixin = exports.inotify_dispatch = void 0;
const api_js_1 = require("../api.js");
const mixin_js_1 = require("../mixin.js");
const inotify_dispatch = (listeners, e) => {
    if (!listeners)
        return;
    for (let i = 0, n = listeners.length, l; i < n; i++) {
        l = listeners[i];
        l[0].call(l[1], e);
        if (e.canceled) {
            return;
        }
    }
};
exports.inotify_dispatch = inotify_dispatch;
/**
 * Mixin class decorator, injects INotify default implementation, incl.
 * a lazily instantiated `_listeners` property object, storing
 * registered listeners.
 */
exports.INotifyMixin = (0, mixin_js_1.mixin)({
    addListener(id, fn, scope) {
        let l = (this._listeners = this._listeners || {})[id];
        !l && (l = this._listeners[id] = []);
        if (this.__listener(l, fn, scope) === -1) {
            l.push([fn, scope]);
            return true;
        }
        return false;
    },
    removeListener(id, fn, scope) {
        let listeners;
        if (!(listeners = this._listeners))
            return false;
        const l = listeners[id];
        if (l) {
            const idx = this.__listener(l, fn, scope);
            if (idx !== -1) {
                l.splice(idx, 1);
                !l.length && delete listeners[id];
                return true;
            }
        }
        return false;
    },
    notify(e) {
        let listeners;
        if (!(listeners = this._listeners))
            return false;
        e.target === undefined && (e.target = this);
        (0, exports.inotify_dispatch)(listeners[e.id], e);
        (0, exports.inotify_dispatch)(listeners[api_js_1.EVENT_ALL], e);
    },
    __listener(listeners, f, scope) {
        let i = listeners.length;
        while (i-- > 0) {
            const l = listeners[i];
            if (l[0] === f && l[1] === scope) {
                break;
            }
        }
        return i;
    },
});
