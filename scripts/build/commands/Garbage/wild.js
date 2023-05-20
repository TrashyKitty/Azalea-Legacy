function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export const WildCommand = {
    name: "wild",
    description: "Teleport to a random place",
    exec(msg, args, commands, toggles) {
        if (!toggles["WildCmd"])
            return "error Wild command is disabled!";
        let minX = 5000;
        let minZ = 5000;
        let x = randomIntFromInterval(-minX, minX);
        let z = randomIntFromInterval(-minZ, minZ);
        msg.sender.teleport({ x, y: 200, z }, msg.sender.dimension, msg.sender.rotation.x, msg.sender.rotation.y);
        return "success Teleported you to " + x + ", " + 200;
    },
};
