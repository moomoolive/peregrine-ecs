import { EVENT_DISABLE, EVENT_ENABLE } from "../api.js";
import { mixin } from "../mixin.js";
/**
 * Mixin class decorator, injects IEnable default implementation, incl.
 * a `_enabled` property. If the target also implements the
 * {@link @thi.ng/api#INotify} interface, {@link IEnable.enable} and
 * {@link IEnable.disable} will automatically emit the respective
 * events.
 */
export const IEnableMixin = mixin({
    _enabled: true,
    isEnabled() {
        return this._enabled;
    },
    enable() {
        $enable(this, true, EVENT_ENABLE);
    },
    disable() {
        $enable(this, false, EVENT_DISABLE);
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
