// @ts-ignore
import * as minecraft from '@minecraft/server';
// @ts-ignore
import {MessageFormData} from '@minecraft/server-ui';
import { cache } from './cache';
import { azaleaEnv } from './env';

// import namespaces
import './events/namespaces/azalea';
import './events/namespaces/azalea-cmd';

export function scriptEvents(toggle, getToggles, toggleAll, messageDataToMessage) { 
    minecraft.system.events.scriptEventReceive.subscribe(async e=>{
        const {
            id,
            message
        } = e;
        let scriptEventNamespaces = cache.get("scriptevent-namespaces");

        // get namespace from /scriptevent
        let namespace = id.split(':')[0];
        // get event id
        let event = id.split(':')[1];

        if(scriptEventNamespaces.has(namespace)) {
            let namespaceEvents = scriptEventNamespaces.get(namespace);
            let found = namespaceEvents.find(eventData=>eventData.name==event);
            if(found) {
                found.exec(e, azaleaEnv);
            }
        }
    })
}