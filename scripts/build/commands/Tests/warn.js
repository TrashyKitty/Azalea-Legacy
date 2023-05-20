import { world } from "@minecraft/server";
export const WarnCommand = {
    name: "warn",
    description: "Warn a player!",
    async exec(msg, args) {
        if (!msg.sender.isOp())
            return msg.sender.sendMessage("You dont have admin");
        let player;
        for (const playr of world.getPlayers()) {
            if (playr.nameTag
                .split("\n")[0]
                .replace(/\u00A7[0-9a-gk-orA-GK-OR]/gi, "") == args[0])
                player = playr;
        }
        if (player) {
            if (args.length == 1) {
                let warns = player
                    .getTags()
                    .filter((_) => _.startsWith("warn:"))
                    .map((_) => _.substring(5));
                msg.sender.sendMessage(`§d${player.name}'s warns\n§r${warns.length
                    ? warns.join("\n§r")
                    : `theres no warns yet!`}`);
                return;
            }
            player.addTag(`warn:${args.slice(1).join(" ")}`);
            player.sendMessage(`§cYou have been warned!\n§cReason: §r${args
                .slice(1)
                .join(" ")}`);
        }
        msg.sender.sendMessage("Warned " + player.name);
    },
};
