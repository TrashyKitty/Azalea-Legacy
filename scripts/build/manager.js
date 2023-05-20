export class AzaleaCommandManager {
    commands;
    constructor() {
        this.commands = new Map();
    }
    registerCommand(name, data, fn) {
        let commandData = {
            usage: data.usage ? data.usage : null,
            name: data.name ? data.name : name,
            description: data.description ? data.description : null,
            addedIn: data.addedInVersion ? data.addedInVersion : "V0.8",
            execute: data.execute ? data.execute : fn,
            category: data.category ? data.category : "Uncategorized",
            registeredAt: Date.now(),
            requiresAdmin: data.requiresAdmin ? true : false
        };
        this.commands.set(data.name ? data.name : name, commandData);
    }
    getCommand(name) {
        return this.commands.has(name) ? this.commands.get(name) : null;
    }
}
