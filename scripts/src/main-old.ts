// @ts-ignore
import * as minecraft from "@minecraft/server";
// @ts-ignore
import * as ui from "@minecraft/server-ui";
import { WildCommand } from "./commands/Garbage/wild";
import { AboutAzaleaCommand } from "./commands/Information/about";
import { CreditsCommand } from "./commands/Information/credits";
import { HelpCommannd } from "./commands/Information/help";
import { TutorialsCommand } from "./commands/Information/tutorials";
import { Warp } from "./commands/Information/warp";
import { WarpCommand } from "./commands/Information/warpCmd";
import { loadTagCmd, TagCMD } from "./commands/tagcmd/tagcmd";
import { DbGetCommand } from "./commands/Tests/dbget";
import { DbSetCommand } from "./commands/Tests/dbset";
import { ErrorTestCommand } from "./commands/Tests/error";
import { idgrabber } from "./commands/Tests/grabids";
import { InfoTestCommand } from "./commands/Tests/info";
import { AddLeaderboardCommand } from "./commands/Tests/lbadd";
import { NicknameCommand } from "./commands/Tests/nickname";
import { idgrabber2 } from "./commands/Tests/resetnicknames";
import { SuccessTestCommand } from "./commands/Tests/success";
import { WarnCommand } from "./commands/Tests/warn";
import { Database } from "./db";
import { azaleaEnv } from "./env"
import { nautilus } from "./modules/nautilus/nautilus";
import { NicknamesModule } from "./modules/nicknames";
import { Tables } from "./tables";
import { StaffchatCommand } from "./utils/staffchat";
NicknamesModule();
// @ts-ignore
loadTagCmd();
const ISNUMREGEX = /^\d+$/;
const DEVELOPERS = ["Trash9240"];
const CREDITS = [
    {
        name: "Trash9240",
        whatTheyDid: "Developer",
    },
];
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
    // AddLeaderboardCommand,
    // WarpCommand,
    TutorialsCommand,
    StaffchatCommand,
    TagCMD
];
nautilus(commands, azaleaEnv);
let toggles = {};
minecraft.world.events.playerJoin.subscribe((e) => {
    let db = new Database(Tables.Nicknames);
    console.warn("Player!");
    console.warn(e.player.id);
    let playerName = e.player.name;
    let player = e.player;
    db.get(`nickname${e.player.id}`).then((nickname) => {
        console.warn(nickname);
        if (nickname) {
            let tickEvent = minecraft.world.events.tick.subscribe((t) => {
                minecraft.world
                    .getDimension("overworld")
                    .runCommandAsync(`testfor ${playerName}`)
                    .then(() => {
                        player.nameTag = nickname;
                        minecraft.world.events.tick.unsubscribe(tickEvent);
                    })
                    .catch(() => {});
            });
        }
    });

    // console.warn(e.playerName)
});
function getToggles() {
    try {
        minecraft.world.scoreboard.addObjective("toggles", "§bToggles");
    } catch (e) {}
    const objective = minecraft.world.scoreboard.getObjective("toggles");
    const participants = objective.getParticipants();
    for (const participant of participants) {
        toggles[participant.displayName] = objective.getScore(participant)
            ? true
            : false;
    }
}
let availableToggles = [
    {
        displayName: "Cancel all explosions",
        id: "CancelExplosions",
    },
    {
        displayName: "!wild",
        id: "WildCmd",
    },
    {
        displayName: "!nickname",
        id: "NicknamesCommand"
    }
];
function setToggle(name, bool) {
    try {
        minecraft.world.scoreboard.addObjective("toggles", "§bToggles");
    } catch (e) {}
    minecraft.world
        .getDimension("overworld")
        .runCommandAsync(
            `scoreboard players set "${name}" toggles ${bool ? "1" : "0"}`
        )
        .then(getToggles);
}

// TEST CODE! DO NOT USE!
// let leaderboards = [
//     {
//         pos: [-4179, 70, -2045],
//         objective: "money",
//         title: "Money"
//     }
// ]
// Instead, use this
let leaderboards = [];
let leaderboardsDb = new Database(Tables.Leaderboards);
let leaderboardEntities = {};
minecraft.system.runInterval(()=>{
    leaderboardsDb.get('lb').then(val=>{
        leaderboards = JSON.parse(val);
    }).catch(err=>{});
}, 60)
minecraft.system.runInterval((e) => {

    for (let i = 0; i < leaderboards.length; i++) {
        let leaderboard = leaderboards[i];
        try {
        if (false) {
            let createEntity = false;
            console.warn("CREATE ENTITY");
            try {
                let entity1 = minecraft.world.getDimension('overworld').getEntitiesAtBlockLocation(new minecraft.BlockLocation(leaderboard.pos[0], leaderboard.pos[1], leaderboard.pos[2]))
                if(entity1 && entity1.length) {
                    leaderboardEntities[leaderboard.objective] = entity1[0];
                } else {
                    createEntity = true;
                }    
            } catch(e) {
                console.warn(e);
                createEntity = true;
            }
            if(createEntity) {
                let overworld = minecraft.world.getDimension("overworld");
                let entity = overworld.spawnEntity(
                    "minecraft:rabbit",
                    new minecraft.Location(
                        leaderboard.pos[0],
                        leaderboard.pos[1],
                        leaderboard.pos[2]
                    )
                );
                leaderboardEntities[leaderboard.objective] = entity;
            }
        } else {
            let createEntity = false;

            try {
                let entity1 = minecraft.world.getDimension('overworld').getEntitiesAtBlockLocation(new minecraft.BlockLocation(Math.floor(leaderboard.pos[0]), Math.floor(leaderboard.pos[1]), Math.floor(leaderboard.pos[2])))
                if(entity1 && entity1.length) {
                    leaderboard.entity = entity1[0];
                } else {
                    let overworld = minecraft.world.getDimension("overworld");
                    // let entity = overworld.spawnEntity(
                    //     "minecraft:rabbit",
                    //     new minecraft.Location(
                    //         leaderboard.pos[0],
                    //         leaderboard.pos[1],
                    //         leaderboard.pos[2]
                    //     )
                    // );
                        // leaderboard.entity = entity;
    
                }    
            } catch(e) {
            }

            let newNameTag = [];
            if(leaderboard.objective != "online") {
                const objective = minecraft.world.scoreboard.getObjective(
                    leaderboard.objective
                );
                const participants = objective.getParticipants();
                newNameTag.push(`§6<-=-=- §c${leaderboard.title} §6-=-=->`);
                let scores = [];
                for (const participant of participants) {
                    scores.push([participant, objective.getScore(participant)]);
                }
                scores = scores.sort((a, b) => a[1] - b[1]);
                for (const score of scores) {
                    if(score[0].displayName == "commands.scoreboard.players.offlinePlayerName") continue;
                    if(leaderboard.objective == "money") {
                        newNameTag.push(`§b${score[0].displayName} §r§7| §r§e${score[1]} `)
                        continue;
                    }
                    newNameTag.push(`§6${score[0].displayName} §r${score[1]}`);
                }
                leaderboard.entity.nameTag = newNameTag.join("\n");
    
            } else {
                let newNameTag = [];
                newNameTag.push(`§6<-=-=- §c${leaderboard.title} §r§6-=-=->`)
                for(const player of minecraft.world.getPlayers()) {
                    newNameTag.push(`§d${player.nameTag.split('\n')[0]}`);
                }
                leaderboard.entity.nameTag = newNameTag.join('\n§r');
            }
        }
    } catch {
        
    }
    }
}, 1);
minecraft.world.events.beforeItemUse.subscribe((event) => {
    if (
        event.item.typeId == "minecraft:echo_shard" &&
        event.source.typeId == "minecraft:player" &&
        event.source.isOp()
    ) {
        // todo: add icons
        let player = event.source;
        getToggles();
        const uiMain = new ui.ActionFormData()
            .title("§9Admin panel V2")
            .body("Welcome to admin panel, select an option")
            .button("Exit")
            .button("Config")
            .button("Name customization")
            .show(event.source)
            .then((result) => {
                if (result.canceled) return console.warn("test");
                if (!result.selection) return;
                if (result.selection == 1) {
                    const configUI = new ui.ModalFormData().title("§9Config");
                    for (const toggle of availableToggles) {
                        configUI.toggle(
                            toggle.displayName,
                            toggles[toggle.id] ? true : false
                        );
                    }
                    configUI.show(player).then((values) => {
                        for (let i = 0; i < values.formValues.length; i++) {
                            setToggle(
                                availableToggles[i].id,
                                values.formValues[i]
                            );
                        }
                    });
                }
                if (result.selection == 2) {
                    const configUI2 = new ui.ModalFormData()
                        .title("Nametag color")
                        .dropdown("Colors", [
                            "Black",
                            "Blue",
                            "Green",
                            "Aqua",
                            "Red",
                            "Magenta",
                            "Gold",
                            "Light Gray",
                            "Dark Gray",
                            "Bright Blue",
                            "Bright Green",
                            "Bright Aqua",
                            "Bright Red",
                            "Bright Magenta",
                            "Yellow",
                            "White",
                        ])
                        .show(player)
                        .then((res) => {
                            player.nameTag = `§${res.formValues[0].toString(
                                16
                            )}${player.name}`;
                        });
                }
            });
    }
});
let playerCommandModeMap = new Map();
minecraft.world.events.beforeChat.subscribe((msg) => {
    msg.cancel = true;
    getToggles();
    if(azaleaEnv.AlternativeMessageHandler) azaleaEnv.AlternativeMessageHandler(msg, commands, toggles, azaleaEnv, playerCommandModeMap, getToggles, DEVELOPERS);
    if (msg.message.startsWith("!")) {
        if(azaleaEnv.alternativeMessageHandlerModifiesCommandHandler) return;
        let command = msg.message.substring(1).split(" ")[0];
        let args = msg.message.split(" ").slice(1);
        let commandToRun = commands.find((cmd) => cmd.name == command);
        if (commandToRun) {
            let response = commandToRun.exec(msg, args, commands, toggles, azaleaEnv);
            if (response && typeof response == "string") {
                if (response.startsWith("error ")) {
                    msg.sender.sendMessage(
                        "§8§l[§r§cERROR§8§l] §r§c" +
                            response.replace("error ", "")
                    );
                } else if (response.startsWith("success ")) {
                    msg.sender.sendMessage(
                        "§8§l[§r§aSUCCESS§8§l] §r§a" +
                            response.replace("success ", "")
                    );
                } else if (response.startsWith("info ")) {
                    msg.sender.sendMessage(
                        "§8§l[§r§bINFO§8§l] §r§b" +
                            response.replace("info ", "")
                    );
                } else {
                    msg.sender.sendMessage(response);
                }
            } else if(response && typeof response == "function") {
                msg.sender.addTag('cancel-chat-messages');
                let response2 = response();
                if(response2) {
                    msg.sender.removeTag('cancel-chat-messages');
                }
                playerCommandModeMap.set(msg.sender.id, response);
            }
            return;
        } else
            return msg.sender.sendMessage(
                "§8§l[§r§cERROR§8§l] §r§cCommand not found!"
            );
    }
    // msg.sender.setOp(true)
    // console.warn(msg.sender.isOp())
    // Check only tags starting with "rank:" and remove "rank:" from the start of the string
    if(azaleaEnv.alternativeMessageHandlerModifiesMessageHandler) return;
    if(playerCommandModeMap.has(msg.sender.id)) {
        let fn = playerCommandModeMap.get(msg.sender.id);
        let fnResponse = fn(msg);
        msg.sender.sendMessage('§6You > §r'+msg.message)
        if(fnResponse) {
            msg.sender.removeTag('cancel-chat-messages');
            playerCommandModeMap.delete(msg.sender.id);
            msg.sender.sendMessage('You have exited command mode!')
            return;
        }
    }
    if(!playerCommandModeMap.has(msg.sender.id)) msg.sender.removeTag('cancel-chat-messages')
    if(msg.sender.hasTag('cancel-chat-messages')) return;
    if(msg.sender.hasTag('staffchat')) {
        for(const player of minecraft.world.getPlayers()) {
            if(player.hasTag('staffchat')) {
                player.sendMessage(`§8<${msg.sender.name}§r§8> §r§7${msg.message}`);
            }
        }
        return;
    }
    getToggles();
    if(toggles['ChatRanks'] == false) {
        msg.cancel = false;
        return;
    }
    let ranks = msg.sender
        .getTags()
        .filter((tag) => tag.startsWith("rank:"))
        .map((rank) => rank.substring(5));
    // Get last 4 characters of string
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

    // Print the message
    minecraft.world.sendMessage(
        `${bracketColor}§l[§r§7${
            ranks.length ? ranks.join("§r, §r§7") : "§dMember"
        }${bracketColor}§l] §r${
            DEVELOPERS.includes(msg.sender.nameTag) ? "§d" : "§7"
        }${chatPrefix2}${msg.sender.hasTag("name-bold") ? "§l" : ""}${
            newNameTag.split("\n")[0]
        }: §r${messagePrefix2}${msg.message}`
    );
});
