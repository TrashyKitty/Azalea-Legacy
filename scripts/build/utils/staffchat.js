import { world } from "@minecraft/server";
export const StaffchatCommand = {
    name: "staff",
    category: "Admin Commands",
    exec(msg, args) {
        if (!msg.sender.isOp())
            return msg.sender.sendMessage('§cStaff chat is for staff, and you are not staff, fk off');
        if (msg.sender.hasTag('staffchat')) {
            msg.sender.removeTag('staffchat');
            msg.sender.sendMessage('§c[-] You have left staff chat');
            for (const player of world.getPlayers()) {
                if (player.hasTag('staffchat'))
                    player.sendMessage(`§c[-] ${msg.sender.name}`);
            }
        }
        else {
            msg.sender.addTag('staffchat');
            msg.sender.sendMessage('§a[+] You joined staff chat');
            for (const player of world.getPlayers()) {
                if (player.hasTag('staffchat'))
                    player.sendMessage(`§a[+] ${msg.sender.name}`);
            }
        }
    }
};
