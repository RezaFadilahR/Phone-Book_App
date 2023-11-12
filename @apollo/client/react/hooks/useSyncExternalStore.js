import { invariant } from "../../utilities/globals/index.js";
import * as React from "react";
import { canUseLayoutEffect } from "../../utilities/index.js";
var didWarnUncachedGetSnapshot = false;
var uSESKey = "useSyncExternalStore";
var realHook = React[uSESKey];
export var useSyncExternalStore = realHook ||
    (function (subscribe, getSnapshot, getServerSnapshot) {
        var value = getSnapshot();
        if (globalThis.__DEV__ !== false &&
            !didWarnUncachedGetSnapshot &&
            value !== getSnapshot()) {
            didWarnUncachedGetSnapshot = true;
            globalThis.__DEV__ !== false && invariant.error(58);
        }
        var _a = React.useState({
            inst: { value: value, getSnapshot: getSnapshot },
        }), inst = _a[0].inst, forceUpdate = _a[1];
        if (canUseLayoutEffect) {
            React.useLayoutEffect(function () {
                Object.assign(inst, { value: value, getSnapshot: getSnapshot });
                if (checkIfSnapshotChanged(inst)) {
                    forceUpdate({ inst: inst });
                }
            }, [subscribe, value, getSnapshot]);
        }
        else {
            Object.assign(inst, { value: value, getSnapshot: getSnapshot });
        }
        React.useEffect(function () {
            if (checkIfSnapshotChanged(inst)) {
                forceUpdate({ inst: inst });
            }
            return subscribe(function handleStoreChange() {
                if (checkIfSnapshotChanged(inst)) {
                    forceUpdate({ inst: inst });
                }
            });
        }, [subscribe]);
        return value;
    });
function checkIfSnapshotChanged(_a) {
    var value = _a.value, getSnapshot = _a.getSnapshot;
    try {
        return value !== getSnapshot();
    }
    catch (_b) {
        return true;
    }
}
//# sourceMappingURL=useSyncExternalStore.js.map