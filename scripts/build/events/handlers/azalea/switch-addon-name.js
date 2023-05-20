export const SwitchNameEvent = {
    name: "switch_addon_name",
    exec(eventData, azaleaEnv) {
        azaleaEnv.AboutAddonName = eventData.message + "§r §a(Powered by Azalea)";
    }
};
