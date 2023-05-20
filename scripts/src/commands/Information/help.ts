export const HelpCommannd = {
    name: "help",
    description: "Get help",
    category: "Help center",
    exec(msg, args, commands) {
        let text = ``;
        let categories = {};
        console.warn(JSON.stringify(commands))
        for (let i = 0; i < commands.length; i++) {
            if(!categories[commands[i].category?commands[i].category:"Uncategorized"]) categories[commands[i].category?commands[i].category:"Uncategorized"] = [];
            categories[commands[i].category?commands[i].category:"Uncategorized"].push(`§a${commands[i].name} §7${
                commands[i].description
                    ? commands[i].description.replace(
                          /\{\{BRANDING\.ADDON_NAME\}\}/g,
                          "Azalea"
                      )
                    : "No description"
            }`);
        }
        for(const category of Object.keys(categories)) {
            const categoryText = categories[category];
            text += `§8<-=-=- §b${category} §r§8-=-=->\n  ${categoryText.join('\n  ')}\n`;
        }
        msg.sender.sendMessage(text);
    },
};
