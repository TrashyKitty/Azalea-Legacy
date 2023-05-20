// @ts-ignore
import { world } from "@minecraft/server";
import { Database } from "../../db";
import { Tables } from "../../tables";

export const idgrabber2 = {
    description: "Grabs user IDs",
    name: "nickreset",
    async exec(msg, args) {
        for (const player of world.getPlayers()) {
            const db = new Database(Tables.Nicknames);
            let nick = await db.get(`nickname${player.id}`);
            if (nick) {
                player.nameTag = nick;
            }
        }
    },
};
