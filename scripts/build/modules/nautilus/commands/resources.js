import * as minecraft from '@minecraft/server';
import { Database } from '../../../db';
export const NautilusResourcesCommand = {
    name: "resources",
    description: "§aView info about the server, and even the rules. Type §o§2!resources manage §r§ato manage the resources",
    exec(msg, args, commands, toggles, azaleaEnv) {
        if (args.length && args[0] == "manage")
            return function (chatmsg) {
                if (!chatmsg.sender.isOp())
                    return true;
                if (!chatmsg) {
                    minecraft.world.sendMessage("§aWelcome to Nautilus Resources management menu. Type §2exit §ato exit");
                    return false;
                }
                if (chatmsg.message == "exit")
                    return true;
                switch (chatmsg.message.toLowerCase()) {
                    case "get info":
                        function get_info(message) {
                            console.warn("GET: INFO");
                            let db = new Database(120);
                            let serverInfo = db.get("Resources.ServerInfo");
                            let rules = db.get("Resources.Rules");
                            console.warn(JSON.stringify(serverInfo));
                            console.warn(JSON.stringify(rules));
                            let returnMessage = [];
                            if (!serverInfo.length)
                                returnMessage.push("§cNo server info set! Type §4server info name §cor §4server info description §cin chat");
                            if (!rules.length)
                                returnMessage.push("§cNo rules! Type §4add rule§c, §4get rule§c, or §4remove rule §cin chat");
                            if (serverInfo) {
                                let serverInfoData = JSON.parse(serverInfo);
                                returnMessage.push("§d<-=-=- SERVER INFO -=-=->");
                                returnMessage.push(`§aName: §r${serverInfoData.name ? serverInfoData.name : "§cNo name"}`);
                                returnMessage.push(`§aDescription: §r${serverInfoData.description ? serverInfoData.description : "§cNo description"}`);
                            }
                            if (rules) {
                                let rulesList = rules.split('-NEW-');
                                returnMessage.push("§d<-=-=- RULES -=-=->");
                                returnMessage.push("§b- §7" + rulesList.join('\n§b- §7'));
                            }
                            return returnMessage;
                        }
                        chatmsg.sender.sendMessage(get_info(chatmsg).join('\n§r'));
                        break;
                    default:
                        chatmsg.sender.sendMessage("§cI dont understand what you mean, try using a different message");
                }
            };
    }
};
