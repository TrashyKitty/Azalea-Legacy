import { cache } from "../../cache";
import { RunEvent } from "../handlers/azalea-cmd/Run";
import { BatchScriptEvent } from "../handlers/azalea/batch";
import { BroadcastScriptevent } from "../handlers/azalea/broadcast";
import { SwitchNameEvent } from "../handlers/azalea/switch-addon-name";
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
