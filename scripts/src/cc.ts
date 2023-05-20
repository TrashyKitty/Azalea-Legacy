// import { Database } from "./db";
import { Tables } from "./tables";
// @ts-ignore
import { Database } from "./SmellyDB/Database";
import { EntitiesLoad } from "./SmellyDB/events/EntitiesLoad";
import { cache } from "./cache";
import { Economy } from "./economy";
// @ts-ignore
import * as mc from '@minecraft/server';
// @ts-ignore
import * as mcui from '@minecraft/server-ui';
// let db = new Database(Tables.CustomCommands);
var db;

async function createCommand(name, data) {
    // 0 = admin command
    // 1 = player command
    let cmdData = {
        name,
        type: data.type ?
            data.type > 1 ? 1
            : data.type < 0 ? 0
            : data.type
        : 0,
        command: data.command
    };
    await db.set(name, cmdData);
    // db.set(name, JSON.stringify(data));
}

function deleteCommand(name) {
    // ok now i need a delete function in the database
}

async function getCommand(name) {
    try {
        let command = await db.getSync(name);
        console.warn(JSON.stringify(command));

    } catch(e) {
        console.warn(e)
    }
}

EntitiesLoad.subscribe(()=>{
    cache.set(
        'commands',
        cache.get('commands').set('cc-start', {
            name: "cc-start",
            description: "cc-end",
            exec(msg, args) {
                // mc.world.sendMessage(args.join(', ')+'\n--------');
                cache.set(`cc-session-${msg.sender.id}-name`, args[0]);
                cache.set(`cc-session-${msg.sender.id}-description`, args[1]);
                cache.set(`cc-session-${msg.sender.id}-category`, args[2]);
                cache.set(`cc-session-${msg.sender.id}`, ``);
            }
        }).set('cc-continue', {
            name: "cc-continue",
            description: "cc-continue",
            exec(msg, args) {
                // mc.world.sendMessage(args.join(', ')+'\n--------');
                if(!cache.has(`cc-session-${msg.sender.id}`)) return;
                cache.set(`cc-session-${msg.sender.id}`, cache.get(`cc-session-${msg.sender.id}`)+args[0])
            }
        }).set('cc-end', {
            name: 'cc-end',
            description: 'cc-end',
            exec(msg, args) {
                // mc.world.sendMessage('END');
                if(!cache.has(`cc-session-${msg.sender.id}`)) return
                let cc2 = cache.get(`cc-session-${msg.sender.id}`);
                cache.delete(`cc-session-${msg.sender.id}`)

                cache.set('commands', cache.get('commands').set('test', {
                    name: cache.get(`cc-session-${msg.sender.id}-name`),
                    description: cache.get(`cc-session-${msg.sender.id}-description`),
                    category: cache.get(`cc-session-${msg.sender.id}-category`),
                    exec(msg,args) {
                        try {
                            // @ts-ignore
                            // console.warn(cc2.split('-').map(_=>String.fromCharCode(parseInt(_, 16))));
                            // @ts-ignore
                            let fn = new Function(cc2.split('-').map(_=>String.fromCharCode(parseInt(_, 16))).join(''))();
                            const PERMS_REGEX = /\<\<\<REQUIRES\: ([\s\S]*?)\>\>\>/g;
                            const permsString = cc2.split('-').map(_=>String.fromCharCode(parseInt(_, 16))).join('').match(PERMS_REGEX);
                            let perms:any = {};
                            if(permsString.length) {
                                let startLength = 13;
                                let endLength = 3;
                                let list = permsString[0].slice(0,-endLength).substring(startLength).split(', ');
                                for(const perm of list) {
                                    if(perm == "AzaleaDatabase") perms.AzaleaDatabase = Database;
                                    if(perm == "MinecraftAPI") perms.MinecraftAPI = {Minecraft: mc, MinecraftUI: mcui};
                                    if(perm == "Experimental-AzaleaAPI") perms.ExperimentalAzaleaAPI = {
                                        Economy
                                    }
                                }
                            }
                            fn(perms, msg.sender, args);
                        } catch(e) {
                            console.warn(e);
                        }
                    }
                }))
                cache.delete(`cc-session-${msg.sender.id}-name`);
                cache.delete(`cc-session-${msg.sender.id}-description`);
                cache.delete(`cc-session-${msg.sender.id}-category`);
            }
        })
    )
    db = new Database<string, any>("CC");

    createCommand("test-cc", {
        command: "gamemode s @s"
    }).then(()=>{
        getCommand("test-cc");
    })
})