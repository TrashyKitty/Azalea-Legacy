import * as minecraft from '@minecraft/server';
export const BroadcastScriptevent = {
    name: "broadcast",
    exec(eventData) {
        minecraft.world.sendMessage("§d§l[BROADCAST] §r§5" + eventData.message);
    }
};
