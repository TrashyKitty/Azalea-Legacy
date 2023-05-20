// Core: manages the commands

/*
TO TRANSLATE:
This command requires admin!
Sorry, but you have to wait {duration} seconds before you can send this command again.
*/

export class Core {
    constructor() {
        // @ts-ignore
        this.translations = {
            "en": {
                "missingPermissions": "This command requires admin!",
                "usingTooFast": "Sorry, but you have to wait {duration} seconds before you can send this command again."
            }
        }
        // @ts-ignore
        this.timeLoaded = Date.now();
    }
}