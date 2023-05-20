/*
The nautilus project

CURRENT TRANSLATIONS: EN
*/

import { Core } from "./core";
// @ts-ignore
import { world } from "@minecraft/server";
import { NautilusResourcesCommand } from "./commands/resources";
import { alternativeCommandHandler } from "./alternativeCommandHandler";
import { NautilusPrefixCommand } from "./commands/prefix";

export function nautilus(commands, azaleaEnv) {
    
    function initialize() {
        // Check azalea version (Anything below 0.9 is not possible, because it adds the azaleaEnv variable)
        if (azaleaEnv.Version < 0x00) {
            world.sendMessage(
                "§cThis version of azalea is incompatible with nautilus. Please update azalea!"
            );
            return;
        }
        if (azaleaEnv.IsDevVersion)
            world.sendMessage(
                "§bDevelopment version detected, nautilus will be running on developer mode"
            );
        if (!azaleaEnv.IsDevVersion)
            return world.sendMessage(
                "§aThis is a development version of Nautilus and does not work on non-development version azalea"
            );
        // Change the azalea !about
        azaleaEnv.AboutAddonName += ` §c+ Nautilus${
            azaleaEnv.IsDevVersion ? " DEV MODE" : ""
        }`;
        let creditLines = [
            " ",
            "§c<-=-=- NAUTILUS -=-=->",
            "§dTRASH - Main developer",
            "§dLiterally everyone else - Either an idea maker, or someone who does absolutely nothing",
        ];
        azaleaEnv.Credits.push(...creditLines);
        azaleaEnv.AlternativeMessageHandler = alternativeCommandHandler;
        azaleaEnv.alternativeMessageHandlerModifiesCommandHandler = true;
        azaleaEnv.alternativeMessageHandlerModifiesMessageHandler = true;

        // Inject translations
        let core = new Core();
        azaleaEnv.Nautilus = new Map();
        // @ts-ignore
        azaleaEnv.Nautilus.set("Translations", core.translations);

    }

    function createCommands() {
        let nautilusCommands = [NautilusResourcesCommand, NautilusPrefixCommand];

        commands.push(...nautilusCommands);    
    }

    initialize();
    createCommands();
}
