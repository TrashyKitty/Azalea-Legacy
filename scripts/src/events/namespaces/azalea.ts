import { cache } from "../../cache";
import { BatchScriptEvent } from "../handlers/azalea/batch";
import { BroadcastScriptevent } from "../handlers/azalea/broadcast";
import { SwitchNameEvent } from "../handlers/azalea/switch-addon-name";

if(!cache.has("scriptevent-namespaces")) cache.set("scriptevent-namespaces", new Map());

function initialize() {
    let scriptEventNamespaces = cache.get("scriptevent-namespaces");

    scriptEventNamespaces.set("azalea", [
        BroadcastScriptevent,
        SwitchNameEvent,
        BatchScriptEvent
    ])

    cache.set("scriptevent-namespaces", scriptEventNamespaces);
}

initialize();