import type { Event } from "../event.js";
export declare const inotify_dispatch: (listeners: any[][], e: Event) => void;
/**
 * Mixin class decorator, injects INotify default implementation, incl.
 * a lazily instantiated `_listeners` property object, storing
 * registered listeners.
 */
export declare const INotifyMixin: (clazz: any) => any;
//# sourceMappingURL=inotify.d.ts.map