import { cache } from "../cache";
import { parseCommand } from "../lib/commandParser";
cache.set('player-command-mode-data', new Map());
export function commandHandler(msg, toggles, env) {
    msg.cancel = true;
    let commands = cache.get("commands");
    let command = parseCommand(msg.message, "!");
    if (!commands.has(command[0]))
        return msg.sender.sendMessage("§c[ERROR] §4Command not found! Type !help to get a list of commands.");
    let commandData = commands.get(command[0]);
    let response = commandData.exec(msg, command.slice(1), Array.from(cache.get('commands').values()), {}, env);
    console.warn(command.slice(1).join(', '));
    if (!response)
        return;
    switch (typeof response) {
        case "string":
            let responseText = response.startsWith('info ') ? `§b[INFO] §3${response.substring(5)}`
                : response.startsWith('warn ') ? `§e[WARN] §6${response.substring(5)}`
                    : response.startsWith('error ') ? `§e[ERROR] §4${response.substring(6)}`
                        : response;
            msg.sender.sendMessage(response);
            break;
        case "function":
            let playerCommandModeData = cache.get("player-command-mode-data");
            playerCommandModeData.set(msg.sender.id, response);
            msg.sender.addTag('command-mode');
            cache.set('player-command-mode-data', playerCommandModeData);
            response(null);
            msg.sender.sendMessage(`§b[INFO] §3You are now in command mode, type exit to exit command mode anytime.`);
    }
}
