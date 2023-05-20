// @ts-ignore
import * as minecraft from '@minecraft/server';
import { cache } from '../../../cache';

export const RunEvent = {
    name: "run",
    async exec(eventData) {
        let commands = cache.get('commands');
        let {message} = eventData;
        let c = message.split(' ')[0];
        let args = message.split(' ').slice(1);
        console.warn(c, args);
        console.warn(eventData.sourceType)
        if(eventData.sourceType == "clientScript") {
            let command = commands.get(c);
            console.warn(command, typeof command);
            command.exec({
                message: `!${c} ${args.join(' ')}`,
                sender: eventData.sourceEntity
            }, args, Array.from(commands.values()), {});
        }
    }
}