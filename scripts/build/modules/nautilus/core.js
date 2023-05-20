export class Core {
    constructor() {
        this.translations = {
            "en": {
                "missingPermissions": "This command requires admin!",
                "usingTooFast": "Sorry, but you have to wait {duration} seconds before you can send this command again."
            }
        };
        this.timeLoaded = Date.now();
    }
}
