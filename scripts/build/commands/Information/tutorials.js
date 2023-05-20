let tutorials = [
    {
        name: "warps",
        text: `Warps are very easy to use, heres how you use them:\n§a!warp set <name>\n§a!warp tp <name> §ror §a!warp <name>\n§a!warp remove <name>\n\n§rPrivate warps (advanced)\nTo create private warps, use §a/scoreboard players set p WARPname 1\n§rwhen you do this, the warp should say §cYou do not have permission to use this warp\n§rTo give permission to a player, use §a/tag player add "private-warp:name"\n\n§7§oNote: the warp name will be different depending on what you named the warp, for example if you named a warp test, the scoreboard would be WARPtest and the tag would be personal-warp:test`
    }
];
export const TutorialsCommand = {
    name: "tutorials",
    description: "Tutorials! Get help with azalea with just 1 command!",
    category: "Help center",
    exec(cmdMsg, args) {
        return (msg) => {
            if (msg) {
                if (msg.message == "exit") {
                    return true;
                }
                let tutorial = tutorials.find(_tutorial => _tutorial.name.toLowerCase() == msg.message.toLowerCase());
                if (tutorial) {
                    msg.sender.sendMessage(` `);
                    msg.sender.sendMessage(`§a${'-'.repeat(16)} §e${tutorial.name} §a${'-'.repeat(16)}`);
                    msg.sender.sendMessage(` `);
                    msg.sender.sendMessage(tutorial.text);
                    msg.sender.sendMessage(` `);
                    msg.sender.sendMessage(`§bType §3exit §bto exit`);
                    msg.sender.sendMessage(` `);
                    msg.sender.sendMessage(`§a${'-'.repeat(32 + msg.message.length + 2)}`);
                    msg.sender.sendMessage(` `);
                }
                else {
                    msg.sender.sendMessage(`§cI couldn't find that tutorial, maybe try typing §4exit §cbecause even this command probably wont be able to help you`);
                }
            }
            else {
                cmdMsg.sender.sendMessage(`§dWelcome to the tutorials command!\n§6§oIf you want to exit this menu, all you need to do is type §eexit §6or if you want to go to a tutorial, just type the name of it in chat.\n§5Tutorial List:\n§7${tutorials.map(_ => _.name).join('\n§7')}`);
            }
        };
    }
};
