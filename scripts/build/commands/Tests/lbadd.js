import { Database } from "../../db";
import { Tables } from "../../tables";
export const AddLeaderboardCommand = {
    name: "lb-add",
    description: "LEADERBOARDS! Hopefully they work now!",
    category: "Tests",
    async exec(msg, args, commands, toggles) {
        try {
            if (!msg.sender.isOp())
                return msg.sender.sendMessage('§cYou cannot create leaderboards without admin!');
            let objective = args[0];
            let displayName = args.slice(1).join(' ');
            let leaderboardsDb = new Database(Tables.Leaderboards);
            let leaderboardsList = leaderboardsDb.get2('lb', []);
            let lb = typeof leaderboardsList == "object" ? leaderboardsList : JSON.parse(leaderboardsList);
            lb.push({
                pos: [msg.sender.location.x, msg.sender.location.y, msg.sender.location.z],
                objective,
                title: displayName
            });
            await leaderboardsDb.set('lb', JSON.stringify(lb));
        }
        catch (e) {
            console.warn(e);
        }
    },
};
