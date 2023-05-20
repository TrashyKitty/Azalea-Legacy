import { cache } from "../cache";
import { parseCommand } from "../lib/commandParser";
// @ts-ignore
import * as minecraft from '@minecraft/server';

// Add a simple player-command-mode-data to the map
cache.set('player-command-mode-data', new Map())

export function commandHandler(msg, toggles, env) {
    // cancel the message from being sent
    msg.cancel = true;

    // get the commands in cache
    let commands = cache.get("commands");

    // parse the message
    let command = parseCommand(msg.message, "!");

    // check if the command exists
    if(!commands.has(command[0])) return msg.sender.sendMessage("§c[ERROR] §4Command not found! Type !help to get a list of commands.");

    // get the command data so you can actually run the command
    let commandData = commands.get(command[0]);
    
    // run the command, and see if theres a response (function for command mode, string for plain text response)
    let response = commandData.exec(msg, command.slice(1), Array.from(cache.get('commands').values()), {}, env);
    console.warn(command.slice(1).join(', '))
    if(!response) return;


    switch(typeof response) {
        case "string":
            let responseText =
                response.startsWith('info ') ? `§b[INFO] §3${response.substring(5)}`
                : response.startsWith('warn ') ? `§e[WARN] §6${response.substring(5)}`
                : response.startsWith('error ') ? `§e[ERROR] §4${response.substring(6)}`
                : response;
            msg.sender.sendMessage(response)
            break;
        case "function":
            // Add the player to the player-command-mode-data map
            let playerCommandModeData = cache.get("player-command-mode-data");
            playerCommandModeData.set(msg.sender.id, response);
            msg.sender.addTag('command-mode');
            cache.set('player-command-mode-data', playerCommandModeData);

            // Call the command mode function with no message to let it know that it has just been called for the first time
            response(null);

            // Respond to the player letting them know that they are in command mode and telling them how to exit
            msg.sender.sendMessage(`§b[INFO] §3You are now in command mode, type exit to exit command mode anytime.`);
    }
}