import { system, world } from "@minecraft/server";
import { DIMENSIONS } from "../utils";
const CALLBACKS = {};
export let ENTITIES_LOADED = false;
function setEntitiesLoaded() {
    ENTITIES_LOADED = true;
    for (const [i, callback] of Object.entries(CALLBACKS)) {
        callback();
        delete CALLBACKS[i];
    }
}
system.run(async () => {
    try {
        await DIMENSIONS.overworld.runCommandAsync(`testfor @a`);
        setEntitiesLoaded();
    }
    catch (error) {
        let e = world.events.playerSpawn.subscribe(() => {
            setEntitiesLoaded();
            world.events.playerSpawn.unsubscribe(e);
        });
    }
});
export class EntitiesLoad {
    static async awaitLoad() {
        if (ENTITIES_LOADED)
            return;
        return new Promise((resolve) => {
            EntitiesLoad.subscribe(resolve);
        });
    }
    static subscribe(callback) {
        const key = Object.keys(CALLBACKS).length;
        if (ENTITIES_LOADED) {
            callback();
            return key;
        }
        CALLBACKS[key] = callback;
        return key;
    }
    static unsubscribe(key) {
        delete CALLBACKS[key];
    }
}
