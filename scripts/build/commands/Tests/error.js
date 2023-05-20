import { world } from "@minecraft/server";
export const ErrorTestCommand = {
    name: "error",
    description: "ERROR TEST",
    category: "Tests",
    exec(msg, args) {
        return (msg = null) => {
            if (msg) {
                world.sendMessage(msg.message);
                if (msg.message == "exit") {
                    return true;
                }
                return false;
            }
            else {
                world.sendMessage("test!");
                return false;
            }
        };
    },
};
