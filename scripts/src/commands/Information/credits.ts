export const CreditsCommand = {
    name: "credits",
    description: "Show all the people who helped with {{BRANDING.ADDON_NAME}}",
    category: "Credits",
    exec(msg, args, commands, toggles, azaleaEnv) {
        msg.sender.sendMessage(`${azaleaEnv.Credits.join('\n§r')}`)
    },
};
