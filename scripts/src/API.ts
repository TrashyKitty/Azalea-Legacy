// @ts-ignore
import * as minecraft from '@minecraft/server';

export class PlayerAPI {
    player:any;
    constructor(player?) {
        this.player = player;
    }
    possibleArrayToVector3(vector3) {
        if(typeof vector3 === "object") {
            if(Array.isArray(vector3)) {
                return {
                    x: vector3[0],
                    y: vector3[1],
                    z: vector3[2]
                }
            } else {
                return {
                    x: vector3.x,
                    y: vector3.y,
                    z: vector3.z
                }
            }
        } else {
            return {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
    sendChatMessage(data, player = this.player) {
        let type = data.type ? data.type : "normal";
        let message = data.message ? data.message : "No Message";
        let from = data.type == "private" ? data.from : null;
        if(type == "private" && !from) return;
        switch(type) {
            case "normal":
                player.sendMessage(message);
                break;
            case "private":
                player.sendMessage(`§8§l[§r§9${data.from} §r--> §bYou§8§l]`)
                break;
            default:
                player.sendMessage(message);
        }
    }

    addIDTag(player = this.player) {
        player.addTag(player.id);
    }

    teleport(player = this.player, location, dimension, sound = true) {
        player.teleport(
            this.possibleArrayToVector3(location),
            minecraft.world.getDimension(dimension),
            player.getRotation().x,
            player.getRotation().y,
        )
        if(sound) {
            // play sound
        }
    }
    convert(player = this.player) {
        return {
            
        }
    }
}
export class WorldAPI {
    constructor() {

    }
    sendMessage(message) {
        minecraft.world.sendMessage(message)
    }
}
export class API {
    players:PlayerAPI;
    constructor() {
        this.players = new PlayerAPI();
    }
}