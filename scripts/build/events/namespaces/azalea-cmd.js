import { cache } from "../../cache";
import { RunEvent } from "../handlers/azalea-cmd/Run";
if (!cache.has("scriptevent-namespaces"))
    cache.set("scriptevent-namespaces", new Map());
function initialize() {
    let scriptEventNamespaces = cache.get("scriptevent-namespaces");
    scriptEventNamespaces.set("azalea-cmd", [
        RunEvent
    ]);
    cache.set("scriptevent-namespaces", scriptEventNamespaces);
}
initialize();
