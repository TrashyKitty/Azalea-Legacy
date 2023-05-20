import { Database } from "../../db";
import * as minecraft from '@minecraft/server';
let handlerDb = new Database(120);
export function alternativeCommandHandler(msg, commands, toggles, azaleaEnv, playerCommandModeMap, getToggles, DEVELOPERS) {
    let prefix = handlerDb.get("Nautilus.Prefix");
    if (!msg.message.startsWith(prefix ? prefix : "!")) {
        if (playerCommandModeMap.has(msg.sender.id)) {
            let fn = playerCommandModeMap.get(msg.sender.id);
            let fnResponse = fn(msg);
            msg.sender.sendMessage('§6You > §r' + msg.message);
            if (fnResponse) {
                msg.sender.removeTag('cancel-chat-messages');
                playerCommandModeMap.delete(msg.sender.id);
                msg.sender.sendMessage('You have exited command mode!');
                return;
            }
        }
        if (!playerCommandModeMap.has(msg.sender.id))
            msg.sender.removeTag('cancel-chat-messages');
        if (msg.sender.hasTag('cancel-chat-messages'))
            return;
        if (msg.sender.hasTag('staffchat')) {
            for (const player of minecraft.world.getPlayers()) {
                if (player.hasTag('staffchat')) {
                    player.sendMessage(`§8<${msg.sender.name}§r§8> §r§7${msg.message}`);
                }
            }
            return;
        }
        if (toggles['ChatRanks'] == false) {
            msg.cancel = false;
            return;
        }
        let ranks = msg.sender
            .getTags()
            .filter((tag) => tag.startsWith("rank:"))
            .map((rank) => rank.substring(5));
        let lastCharacters = msg.sender.nameTag.slice(-4);
        let newNameTag = msg.sender.nameTag.substring(0);
        let bracketPrefix = msg.sender
            .getTags()
            .find((_) => _.startsWith("bracket-prefix:"));
        let bracketColor = bracketPrefix
            ? bracketPrefix.substring("bracket-prefix:".length)
            : "§8";
        let chatPrefix = msg.sender
            .getTags()
            .find((_) => _.startsWith("chat-prefix:"));
        let chatPrefix2 = chatPrefix
            ? `§r§7(${chatPrefix.substring("chat-prefix:".length)}§r§7) `
            : "";
        let messagePrefix = msg.sender
            .getTags()
            .find((_) => _.startsWith("message-prefix:"));
        let messagePrefix2 = messagePrefix
            ? messagePrefix.substring("message-prefix:".length)
            : "";
        minecraft.world.sendMessage(`${bracketColor}§l[§r§7${ranks.length ? ranks.join("§r, §r§7") : "§dMember"}${bracketColor}§l] §r${DEVELOPERS.includes(msg.sender.nameTag) ? "§d" : "§7"}${chatPrefix2}${msg.sender.hasTag("name-bold") ? "§l" : ""}${newNameTag.split("\n")[0]}: §r${messagePrefix2}${msg.message}`);
        return;
    }
    ;
    let command = msg.message.substring((prefix ? prefix : "!").length).split(" ")[0];
    let args = msg.message.split(" ").slice(1);
    let commandToRun = commands.find((cmd) => cmd.name == command);
    if (commandToRun) {
        let response = commandToRun.exec(msg, args, commands, toggles, azaleaEnv);
        if (response && typeof response == "string") {
            if (response.startsWith("error ")) {
                msg.sender.sendMessage("§8§l[§r§cERROR§8§l] §r§c" +
                    response.replace("error ", ""));
            }
            else if (response.startsWith("success ")) {
                msg.sender.sendMessage("§8§l[§r§aSUCCESS§8§l] §r§a" +
                    response.replace("success ", ""));
            }
            else if (response.startsWith("info ")) {
                msg.sender.sendMessage("§8§l[§r§bINFO§8§l] §r§b" +
                    response.replace("info ", ""));
            }
            else {
                msg.sender.sendMessage(response);
            }
        }
        else if (response && typeof response == "function") {
            msg.sender.addTag('cancel-chat-messages');
            let response2 = response();
            if (response2) {
                msg.sender.removeTag('cancel-chat-messages');
            }
            playerCommandModeMap.set(msg.sender.id, response);
        }
        return;
    }
    else
        return msg.sender.sendMessage("§8§l[§r§cERROR§8§l] §r§cCommand not found!");
}
