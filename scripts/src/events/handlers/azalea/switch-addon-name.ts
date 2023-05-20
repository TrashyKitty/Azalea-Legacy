// @ts-ignore
import * as minecraft from '@minecraft/server';

export const SwitchNameEvent = {
    name: "switch_addon_name",
    exec(eventData:any, azaleaEnv) {
        azaleaEnv.AboutAddonName = eventData.message + "§r §a(Powered by Azalea)";
    }
}