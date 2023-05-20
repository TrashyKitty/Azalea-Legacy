export const AboutAzaleaCommand = {
    name: "about",
    description: "About azalea",
    category: "Info",
    exec(msg, args, commands, toggles, azaleaEnv) {
        let returnText = [azaleaEnv.AboutAddonName, "§9Version: V" + ((azaleaEnv.Version+9)/10).toFixed(1), ""];
        returnText.push(...azaleaEnv.Credits);
        msg.sender.sendMessage(returnText.join('\n'));
    },
};
