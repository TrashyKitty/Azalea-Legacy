import * as minecraft from "@minecraft/server";
export function NicknamesModule() {
    minecraft.system.runInterval((e) => {
        for (const player of minecraft.world.getPlayers()) {
            let nameColor = player
                .getTags()
                .find((_) => _.startsWith("name-color:"))
                ?.substring("name-color:".length);
            let bracketColor = player
                .getTags()
                .find((_) => _.startsWith("bracket-prefix:"))
                ?.substring("bracket-prefix:".length);
            let rankText = player
                .getTags()
                .filter((tag) => tag.startsWith("rank:"))
                .map((rank) => rank.substring(5))
                .join("§r, ");
            let healthComponent = player.getComponent("health");
            if (nameColor && !/\u00A7[0-9a-gk-orA-GK-OR]/.test(nameColor))
                nameColor = "";
            if (!nameColor)
                nameColor = "";
            if (!bracketColor)
                bracketColor = "§f";
            player.nameTag = `${nameColor}${player.hasTag("name-bold") ? "§l" : ""}${player.nameTag
                .split("\n")[0]
                .replace(/\u00A7[0-9a-gk-orA-GKM-OR]/gi, "")}\n§r${bracketColor}< ${rankText ? rankText : "§dMember"} §r${bracketColor}>\n§2${healthComponent.current}/${healthComponent.value} §a${"█".repeat(Math.floor((healthComponent.current / healthComponent.value) * 5)) +
                "░".repeat(5 -
                    Math.floor((healthComponent.current / healthComponent.value) *
                        5))}`;
        }
    }, 10);
}
