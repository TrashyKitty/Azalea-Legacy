import * as mc from '@minecraft/server';
export class Warp {
    constructor() {
    }
    set(name, x, y, z, dimension, isPrivate = false) {
        try {
            mc.world.scoreboard.addObjective(`WARP${name}`, `§bWarp: ${name}`);
        }
        catch { }
        let dimensions = [['minecraft:overworld', 0], ['minecraft:nether', 1], ['minecraft:the_end', 2]];
        console.warn(dimension.id);
        dimension.runCommandAsync(`scoreboard players set d "WARP${name}" ${dimensions.find(_ => dimension.id == _[0])[1]}`);
        dimension.runCommandAsync(`scoreboard players set x "WARP${name}" ${Math.floor(x)}`);
        dimension.runCommandAsync(`scoreboard players set y "WARP${name}" ${Math.floor(y)}`);
        dimension.runCommandAsync(`scoreboard players set z "WARP${name}" ${Math.floor(z)}`);
        dimension.runCommandAsync(`scoreboard players set p "WARP${name}" ${isPrivate ? 1 : 0}`);
    }
    get(name) {
        try {
            let objective = mc.world.scoreboard.getObjective(`WARP${name}`);
            let participants = objective.getParticipants();
            let objectToReturn = {};
            objectToReturn['name'] = name;
            for (const participant of participants) {
                let score = objective.getScore(participant);
                let name = participant.displayName;
                switch (name) {
                    case 'p':
                        objectToReturn['private'] = score > 0 ? true : false;
                        break;
                    case 'd':
                        let dimensions = [
                            mc.world.getDimension('minecraft:overworld'),
                            mc.world.getDimension('minecraft:nether'),
                            mc.world.getDimension('minecraft:the_end')
                        ];
                        objectToReturn['dimension'] = dimensions[score];
                        break;
                    default:
                        objectToReturn[name] = score;
                }
            }
            return objectToReturn;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    remove(name) {
        try {
            mc.world.scoreboard.removeObjective(`WARP${name}`);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    list() {
        let objectives = mc.world.scoreboard.getObjectives();
        let warpNames = [];
        for (const objective of objectives) {
            if (objective.id.startsWith('WARP'))
                warpNames.push(objective.id.substring(4));
        }
        return warpNames;
    }
    tp(player, warpObject) {
        let { x, y, z } = warpObject;
        player.teleport({ x, y, z }, warpObject.dimension, player.rotation.x, player.rotation.y);
        player.sendMessage("§dTeleporting you to warp: §a" + warpObject.name);
    }
}
export const warp = new Warp();
