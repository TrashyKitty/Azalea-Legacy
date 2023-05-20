import { world } from '@minecraft/server';

class MessageAPI {
    // sends a message to selectors
    WorldMessage(text) {
        world.sendMessage(text);
    }

    // sends a message to everyone with a specific tag
    TagMessage(text, tag) {
        for(const player of world.getPlayers()) {
            if(!player.hasTag(tag)) continue;
            player.sendMessage(text.replaceAll(`§x`, player.name));
        }
    }

    // sends a message to everyone with/without OP
    OPMessage(text, hasOp = true) {
        for(const player of world.getPlayers()) {
            if(player.isOp() != hasOp) continue;
            player.sendMessage(text);
        }
    }

    // sends a message to everyone in staffchat
    StaffchatMessage(text) {
        this.TagMessage(text, "staffchat");
    }
}

export const messages = new MessageAPI;