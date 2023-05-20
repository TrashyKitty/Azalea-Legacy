import { Database } from "../../db"
import { Tables } from "../../tables"

// TODO
function handleTagCmdManage(key, val) {
    return;
}
export async function loadTagCmd(commands) {
    let db = new Database(Tables.AzaleaData);

    let tagCommandsString = await db.get("tagcmds");
    let tagCommandsData = tagCommandsString ? JSON.parse(tagCommandsString) : [];

    for(const tagcmd of tagCommandsData) {
        let data = {
            name: tagcmd.name,
            tag: tagcmd.tag
        }
        commands.push({
            name: tagcmd.name,
            exec: (msg, args)=>{
                tagCmdHandler(msg, args, data)
            }
        })
    }
}
function tagCmdHandler(msg, args, data) {
    if(args.length) {
        if(args[0] == "/manage" && msg.sender.isOp()) {
            if(args.length == 3) {
                let key = args[1];
                let val = args[2];
                handleTagCmdManage(key, val);
            }
        } else {
            msg.sender.sendMessage("§cInvalid argument!");
        }
    } else if(data.tag && data.name) {
        msg.sender.addTag(data.tag);
        msg.sender.sendMessage("§9Gave tag: §b"+data.tag);
    } else {
        msg.sender.sendMessage("§cAn unknown error occurred");
    }
}

export const TagCMD = {
    name: "tagcmd",
    beta: true,
    category: "§bUtilities",
    async exec(msg, args, commands) {
        let db = new Database(Tables.AzaleaData);
        let tagCommandsString = await db.get("tagcmds");
        let tagCommandsData = tagCommandsString ? JSON.parse(tagCommandsString) : [];
        let data = {
            name: args[0],
            tag: args[1]
        }
        tagCommandsData.push(data);
        await db.set("tagcmds", JSON.stringify(tagCommandsData));
        commands.push({
            name: commands.find(_=>_.name.toLowerCase() == data.name.toLowercase()) ? args[0] + "~" + data.tag : args[0],
            exec: (msg, args)=>{
                tagCmdHandler(msg, args, data)
            }
        })
    }
}