// @ts-ignore
import {Player} from '@minecraft/server';
import { Database } from './SmellyDB/Database';
import { EntitiesLoad } from './SmellyDB/events/EntitiesLoad';

EntitiesLoad.subscribe(()=>{
    let playerDB = new Database<string, any>("Players");

    Object.assign(Player.prototype, {
        async getData() {
            console.warn("Hi!!!!", this.id);
            return await playerDB.getSync('player-'+this.id) ?? {};
        },
        async setData(data) {
            return await playerDB.set("player-"+this.id, data);
        }
    });
})
