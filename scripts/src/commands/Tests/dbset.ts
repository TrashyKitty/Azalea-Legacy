// @ts-ignore
import { world } from "@minecraft/server";
import { Database } from "../../db";

export const DbSetCommand = {
    name: "dbset",
    category: "Tests",
    async exec(msg, args) {
        if (!msg.sender.isOp())
            return msg.sender.sendMessage("§cThis command requires admin!");
        console.warn(args);
        let db = new Database(parseInt(args[0]));
        await db.set(args[1], args[2].replace(/\^/g, " "));
        world.sendMessage("Done!");
    },
};
