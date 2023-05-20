/*
AZALEA RANK PERMISSIONS

All of these will be bypassed if the user has op
*/

// Import things
import { Database } from "../db";
import { RankPermissions } from "../perms";
import { Tables } from "../tables";

// Create a function that adds rank permissions
export async function addRankPermissions(rankName, permissionList) {
    let db = new Database(Tables.RankPerms);
    await db.set(
        rankName,
        JSON.stringify(permissionList.filter((num) => typeof num == "number"))
    );
}
export async function hasRankPermission(rankName, permission, player = null) {
    if (player && player.isOp()) return true;
    let db = new Database(Tables.RankPerms);
    let rankPerms = await db.get(rankName);
    if (rankPerms) {
        let perms = JSON.parse(rankPerms);
        return perms.includes(permission);
    }
}
