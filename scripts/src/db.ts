// @ts-ignore
import * as minecraft from "@minecraft/server";
import {cache} from './cache';

export class Database {
    /**
     * 
     * @param {number} table Table ID
     */
    table: number;
    constructor(table) {
        this.table = table;
    }
    
    /**
     * @description Sets a value
     * @param {string} key 
     * @param {string} val 
     */
    async set(key, val) {
        try {
            minecraft.world.scoreboard.removeObjective(
                `VAL${this.table}${key}`
            );
        } catch {}
        try {
            minecraft.world.scoreboard.addObjective(
                `VAL${this.table}${key}`,
                `§e${key}`
            );
            minecraft.world.scoreboard.addObjective(
                `table_data`,
                `§dTable Data`
            );
        } catch {}
        let overworld = minecraft.world.getDimension("overworld");
        await overworld.runCommandAsync(
            `scoreboard players set "${key}" table_data ${this.table}`
        );
        await overworld.runCommandAsync(
            `scoreboard players set "l" "VAL${this.table}${key}" ${val.length}`
        );
        // console.warn(val.length);
        for (let i = 0; i < val.length; i++) {
            // console.warn(i);
            try {

            let result = await overworld.runCommandAsync(
                `scoreboard players set "${i}" "VAL${this.table}${key}" ${val[
                    i
                ].charCodeAt()}`
            );
            // console.warn(result.successCount);
        } catch {

        }
        }
        // let i = 0;
        // minecraft.system.runInterval(()=>{
        //     i++;
        //     if(i >= val.length) return;
        //     overworld.runCommandAsync(
        //         `scoreboard players set "${i}" "VAL${this.table}${key}" ${val[
        //             i
        //         ].charCodeAt()}`
        //     );
        // }, 1)
        cache.set(`${this.table};${key}`, val);
    }

    /**
     * @description gets a value
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {string}
     */
    get(key, defaultValue:any="") {
        if(this.table == 50) console.warn("GET")
        if(cache.has(`${this.table};${key}`)) {
            let result = cache.get(`${this.table};${key}`)
            if(this.table == 50) console.warn('Found in cache: '+result)
            return result;
        } else {
            if(this.table == 50) console.warn("Not found!")
        }
        try {
            let objective = minecraft.world.scoreboard.getObjective(
                `VAL${this.table}${key}`
            );
            let participants = objective.getParticipants();
            // console.warn(participants.length);
            let chars = [];
            for (const participant of participants) {
                if (participant.displayName == "l") continue;
                chars.push([
                    String.fromCharCode(objective.getScore(participant)),
                    parseInt(participant.displayName),
                ]);
            }
            // console.warn(chars);
            let chars2 = chars
                .sort((a, b) => a[1] - b[1])
                .map((_) => {
                    return _[0];
                })
                .join("");
            // console.warn(chars2.length);
            return chars2.length > 0 ? chars2 : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    /**
     * @description A non-async version of get (idk why i added this)
     * @param {string} key
     * @param {any?} defaultValue
     * @returns {string}
     */
    get2(key, defaultValue:any="") {
        try {
            let objective = minecraft.world.scoreboard.getObjective(
                `VAL${this.table}${key}`
            );
            let participants = objective.getParticipants();
            let chars = [];
            for (const participant of participants) {
                if (participant.displayName == "l") continue;
                chars.push([
                    String.fromCharCode(objective.getScore(participant)),
                    parseInt(participant.displayName),
                ]);
            }
            let chars2 = chars
                .sort((a, b) => a[1] - b[1])
                .map((_) => {
                    return _[0];
                })
                .join("");
            return chars2.length > 0 ? chars2 : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    /**
     * 
     * @returns {string[]} The list of keys in a table
     */
    keys() {
        try {
            // let objective =
            //     minecraft.world.scoreboard.getObjective(`table_data`);
            let objectives = minecraft.world.scoreboard.getObjectives();
            let keys = [];
            for(const objective of objectives) {
                if(objective.id.startsWith(`VAL${this.table}`)) {
                    keys.push(objective.id.substring(`VAL${this.table}`.length));
                }
            }
            // let participants = objective.getParticipants();
            // let keys = [];
            // for (const participant of participants) {
            //     if (objective.getScore(participant) == this.table) {
            //         try {
            //             minecraft.world.scoreboard.getObjective(`VAL${this.table}${participant.displayName}`);
            //         } catch {
            //             objective.removeParticipant(participant);
            //             continue;
            //         }
            //         keys.push(participant.displayName);
            //     }
            // }
            return keys;
        } catch {
            return [];
        }
    }
}
