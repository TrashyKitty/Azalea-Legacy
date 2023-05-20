import { world } from "@minecraft/server";
export const idgrabber = {
    description: "Grabs user IDs",
    name: "idgrabber",
    exec(msg, args) {
        for (const player of world.getPlayers()) {
            world.sendMessage(`Name: ${player.name} | ID: ${player.id}`);
        }
    },
};
