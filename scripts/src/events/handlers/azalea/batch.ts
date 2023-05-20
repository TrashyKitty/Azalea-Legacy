// @ts-ignore
import * as minecraft from '@minecraft/server';

export const BatchScriptEvent = {
    name: "batch",
    async exec(eventData) {
        let {message} = eventData;
        let messageParts = message.split(' ; ');
        let overworld = minecraft.world.getDimension('overworld');
        for(const part of messageParts) {
            await overworld.runCommandAsync(part);
        }
    }
}