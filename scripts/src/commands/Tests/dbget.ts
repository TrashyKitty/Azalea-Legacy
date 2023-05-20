// @ts-ignore
import { world } from "@minecraft/server";
import { Database } from "../../db";

export const DbGetCommand = {
    name: "dbget",
    category: "Tests",
    async exec(msg, args) {
        if (!msg.sender.isOp())
            return msg.sender.sendMessage("§cThis command requires admin!");
        console.warn(args);
        let db = new Database(parseInt(args[0]));
        let val = await db.get(args[1]);
        console.warn(val.substring(1));
        world.sendMessage("Done! --> " + val);
    },
};
