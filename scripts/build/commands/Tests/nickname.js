import { Database } from "../../db";
import { Tables } from "../../tables";
export const NicknameCommand = {
    name: "nickname",
    description: "Nicknames!",
    category: "Tests",
    exec(msg, args, commands, toggles) {
        console.warn(JSON.stringify(toggles));
        if (!toggles.NicknamesCommand)
            return msg.sender.sendMessage('§cNicknames are disabled! You can try asking admins to enable them using admin panel.');
        msg.sender.nameTag = msg.sender.nameTag.startsWith("§")
            ? msg.sender.nameTag[0] + msg.sender.nameTag[1] + args.join(" ")
            : args.join(" ");
        const db = new Database(Tables.Nicknames);
        db.set(`nickname${msg.sender.id}`, args.join(" "));
        return "info New name! " + msg.sender.nameTag;
    },
};
