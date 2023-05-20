import * as minecraft from "@minecraft/server";
import { cache } from './cache';
export class Database {
    table;
    constructor(table) {
        this.table = table;
    }
    async set(key, val) {
        try {
            minecraft.world.scoreboard.removeObjective(`VAL${this.table}${key}`);
        }
        catch { }
        try {
            minecraft.world.scoreboard.addObjective(`VAL${this.table}${key}`, `§e${key}`);
            minecraft.world.scoreboard.addObjective(`table_data`, `§dTable Data`);
        }
        catch { }
        let overworld = minecraft.world.getDimension("overworld");
        await overworld.runCommandAsync(`scoreboard players set "${key}" table_data ${this.table}`);
        await overworld.runCommandAsync(`scoreboard players set "l" "VAL${this.table}${key}" ${val.length}`);
        for (let i = 0; i < val.length; i++) {
            try {
                let result = await overworld.runCommandAsync(`scoreboard players set "${i}" "VAL${this.table}${key}" ${val[i].charCodeAt()}`);
            }
            catch {
            }
        }
        cache.set(`${this.table};${key}`, val);
    }
    get(key, defaultValue = "") {
        if (this.table == 50)
            console.warn("GET");
        if (cache.has(`${this.table};${key}`)) {
            let result = cache.get(`${this.table};${key}`);
            if (this.table == 50)
                console.warn('Found in cache: ' + result);
            return result;
        }
        else {
            if (this.table == 50)
                console.warn("Not found!");
        }
        try {
            let objective = minecraft.world.scoreboard.getObjective(`VAL${this.table}${key}`);
            let participants = objective.getParticipants();
            let chars = [];
            for (const participant of participants) {
                if (participant.displayName == "l")
                    continue;
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
        }
        catch {
            return defaultValue;
        }
    }
    get2(key, defaultValue = "") {
        try {
            let objective = minecraft.world.scoreboard.getObjective(`VAL${this.table}${key}`);
            let participants = objective.getParticipants();
            let chars = [];
            for (const participant of participants) {
                if (participant.displayName == "l")
                    continue;
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
        }
        catch {
            return defaultValue;
        }
    }
    keys() {
        try {
            let objectives = minecraft.world.scoreboard.getObjectives();
            let keys = [];
            for (const objective of objectives) {
                if (objective.id.startsWith(`VAL${this.table}`)) {
                    keys.push(objective.id.substring(`VAL${this.table}`.length));
                }
            }
            return keys;
        }
        catch {
            return [];
        }
    }
}
