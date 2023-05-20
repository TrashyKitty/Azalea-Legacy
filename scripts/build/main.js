import * as minecraft from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import './admin-panel';
import './SmellyDB/index';
import './shopApi';
import { WildCommand } from "./commands/Garbage/wild";
import { AboutAzaleaCommand } from "./commands/Information/about";
import { CreditsCommand } from "./commands/Information/credits";
import { HelpCommannd } from "./commands/Information/help";
import { TutorialsCommand } from "./commands/Information/tutorials";
import { WarpCommand } from "./commands/Information/warpCmd";
import { TagCMD } from "./commands/tagcmd/tagcmd";
import { DbGetCommand } from "./commands/Tests/dbget";
import { DbSetCommand } from "./commands/Tests/dbset";
import { ErrorTestCommand } from "./commands/Tests/error";
import { InfoTestCommand } from "./commands/Tests/info";
import { NicknameCommand } from "./commands/Tests/nickname";
import { SuccessTestCommand } from "./commands/Tests/success";
import { WarnCommand } from "./commands/Tests/warn";
import { Database } from "./db";
import { azaleaEnv } from "./env";
import { StaffchatCommand } from "./utils/staffchat";
import { cache } from "./cache";
import { commandHandler } from "./handlers/commands";
import { scriptEvents } from "./script-events";
import './prototypes';
import './cc';
import { system } from "@minecraft/server";
let lastTick = Date.now();
let tps = 20;
let timeArray = [];
system.runInterval(() => {
    if (timeArray.length === 20)
        timeArray.shift();
    timeArray.push(Math.round(1000 / (Date.now() - lastTick) * 100) / 100);
    tps = timeArray.reduce((a, b) => a + b) / timeArray.length;
    lastTick = Date.now();
});
ui;
for (const override of azaleaEnv.Overrides) {
    if (override.condition.startsWith('source = ')) {
        let val = parseInt(override.condition.replace('source = ', ''));
        if (val == azaleaEnv.DownloadedSource) {
            azaleaEnv.AboutAddonName = override.AboutAddonName;
            azaleaEnv.Credits = override.Credits;
        }
    }
}
cache.set("commands", new Map());
let toggles = [];
for (let i = 0; i < 32; i++) {
    toggles.push({
        mask: 1 << i,
        name: `Toggle${i + 1}`,
        description: `A test toggle! x${i + 1}`
    });
}
let toggleNum = 0;
try {
    let objective = minecraft.world.scoreboard.getObjective("Toggles");
    let participants = objective.getParticipants();
    for (const participant of participants) {
        toggleNum = objective.getScore(participant) >>> 0;
    }
}
catch { }
function toggle(id) {
    const { mask, name, description } = toggles[id];
    toggleNum ^= mask;
    toggleNum >>>= 0;
    let toggleNumString = toggleNum.toString(2);
    if (azaleaEnv.IsDevVersion)
        minecraft.world.sendMessage(`${name}: ${description} §7toggled!\nNew number: ${"0".repeat(32).slice(0, -(toggleNumString.length))}${toggleNumString}`);
    if (azaleaEnv.IsDevVersion)
        minecraft.world.sendMessage(toggleNum.toString());
    try {
        minecraft.world.scoreboard.addObjective("Toggles", "§b<-=- §dAZALEA TOGGLES §b-=->");
    }
    catch { }
    minecraft.world.getDimension('overworld').runCommandAsync(`scoreboard players set "BITWISE" Toggles ${toggleNum >> 0}`);
}
function isToggled(id) {
    const { mask } = toggles[id];
    return (toggleNum & mask) ? true : false;
}
function toggleAll() {
    for (let i = 0; i < toggles.length; i++) {
        toggle(i);
    }
}
function getToggles() {
    let toggleDataList = [];
    for (const toggleConfig of toggles.reverse()) {
        let state = (toggleNum & toggleConfig.mask) ? true : false;
        toggleDataList.push({
            name: toggleConfig.name,
            state
        });
    }
    if (azaleaEnv.IsDevVersion) {
        let text = "§b0b";
        for (const t of toggleDataList)
            text += t.state ? `§a1` : `§c0`;
        minecraft.world.sendMessage(text);
        minecraft.world.sendMessage("§b0b" + ("0".repeat(32).slice(0, -(toggleNum.toString(2).length)) + toggleNum.toString(2).replaceAll("1", "§a1").replaceAll("0", "§c0")));
    }
    return toggleDataList;
}
(function () {
    let commandsMap = cache.get("commands");
    const commands = [
        CreditsCommand,
        InfoTestCommand,
        ErrorTestCommand,
        SuccessTestCommand,
        HelpCommannd,
        WildCommand,
        DbSetCommand,
        DbGetCommand,
        NicknameCommand,
        AboutAzaleaCommand,
        WarnCommand,
        TutorialsCommand,
        StaffchatCommand,
        TagCMD,
        WarpCommand
    ];
    for (const command of commands) {
        commandsMap.set(command.name, command);
    }
    cache.set("commands", commandsMap);
})();
let db11 = new Database(11);
let messagesCache = db11.keys();
function messageDataToMessage(data) {
    let username = data.username, ranks = data?.ranks?.length ? data.ranks : ["§bMember"], nameColor = data?.nameColor ? data.nameColor : "§b", bracketColor = data?.bracketColor ? data.bracketColor : "§8", messageColor = data?.messageColor ? data.messageColor : "§r", suffix = data?.suffix ? ` §o${data.suffix}§r` : "", prefix = data?.prefix ? `§o${data.prefix}§r ${nameColor}` : ``, message = data.message;
    let rankBracket = [`§l${bracketColor}[§r`, `§r${bracketColor}§l]`];
    let ranksJoined = `${rankBracket[0]}${ranks.join('§r§7, ')}${rankBracket[1]}`;
    return `${ranksJoined} §r${nameColor}${prefix}${username}${suffix}${bracketColor}: ${messageColor}${message}`;
}
function getTagsWithStartsWith(player, start, all = false, remove = false) {
    let tags = player.getTags();
    let foundTags = tags.filter(tag => tag.startsWith(start));
    if (remove)
        foundTags = foundTags.map(tag => tag.substring(start.length));
    if (!all)
        foundTags = foundTags[0];
    return foundTags;
}
minecraft.world.events.playerJoin.subscribe((eventData) => {
    const { playerId, playerName } = eventData;
    let loop = minecraft.system.runInterval(() => {
        for (const player of minecraft.world.getPlayers()) {
            if (player.id != playerId)
                continue;
            minecraft.system.runTimeout(() => {
                let messagesCacheSorted = messagesCache.sort((a, b) => parseInt(a) - parseInt(b));
                if (messagesCacheSorted.length > 40) {
                    let toRemove = messagesCacheSorted.slice(0, messagesCacheSorted.length - 40);
                    for (const remove of toRemove) {
                        console.warn(remove);
                        minecraft.world.scoreboard.removeObjective(`VAL11${remove}`);
                        messagesCacheSorted = messagesCacheSorted.slice(1);
                    }
                }
                for (const message of messagesCacheSorted) {
                    let data = db11.get(message);
                    console.warn(data);
                    try {
                        player.sendMessage(`§8§l[§aSAVED§8]§r ` + messageDataToMessage(JSON.parse(data)));
                    }
                    catch {
                        player.sendMessage(`§8§l[§aSAVED§8] §cERROR`);
                    }
                }
                messagesCache = db11.keys();
            }, 20);
            minecraft.system.clearRun(loop);
        }
    }, 40);
});
let chatRanksEnabled = true;
minecraft.world.events.beforeChat.subscribe((msg) => {
    if (msg.message.startsWith('!')) {
        commandHandler(msg, toggleNum, azaleaEnv);
    }
    else if (!msg.message.startsWith('!') && chatRanksEnabled) {
        if (msg.sender.hasTag('command-mode')) {
            msg.cancel = true;
            let playerCommandModeData = cache.get('player-command-mode-data');
            if (playerCommandModeData.has(msg.sender.id)) {
                let fn = playerCommandModeData.get(msg.sender.id);
                let res = fn(msg);
                msg.sender.sendMessage('§aYou > §d' + msg.message);
                if (res) {
                    playerCommandModeData.delete(msg.sender.id);
                    msg.sender.removeTag('command-mode');
                }
            }
            return;
        }
        ;
        msg.cancel = true;
        let ranks = getTagsWithStartsWith(msg.sender, "rank:", true, true);
        if (!ranks.length)
            ranks = ["§bMember"];
        let nameColor = getTagsWithStartsWith(msg.sender, "name-color:", false, true);
        if (!nameColor)
            nameColor = "§b";
        let messageData = {
            nameColor,
            ranks,
            message: msg.message,
            username: msg.sender.nameTag,
            bracketColor: "§8",
            messageColor: "§r"
        };
        db11.set(Date.now().toString(), JSON.stringify(messageData));
        minecraft.world.sendMessage(messageDataToMessage(messageData));
    }
});
scriptEvents(toggle, getToggles, toggleAll, messageDataToMessage);
