import { Database } from "../../../db"

let handlerDb = new Database(120);

export const NautilusPrefixCommand = {
    name: "nautilus-prefix",
    description: "Change the boring ! prefix to something else",
    exec(msg, args) {
        if(!msg.sender.isOp()) {
            return msg.sender.sendMessage("§cSorry, but this command requires admin.");
        }
        if(args.length) {
            handlerDb.set("Nautilus.Prefix", args[0]);
            return msg.sender.sendMessage("§aSuccessfully set the prefix to §2"+args[0])
        } else {
            return msg.sender.sendMessage("§cPlease specify a prefix! Example: §4!nautilus-prefix >");
        }
    }
}