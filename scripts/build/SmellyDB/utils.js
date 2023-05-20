import { MinecraftDimensionTypes, system, world } from "@minecraft/server";
export const DIMENSIONS = {
    overworld: world.getDimension(MinecraftDimensionTypes.overworld),
    nether: world.getDimension(MinecraftDimensionTypes.nether),
    theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
    "minecraft:overworld": world.getDimension(MinecraftDimensionTypes.overworld),
    "minecraft:nether": world.getDimension(MinecraftDimensionTypes.nether),
    "minecraft:the_end": world.getDimension(MinecraftDimensionTypes.theEnd),
};
export async function awaitEntitiesLoad() {
    return new Promise((resolve) => {
        let s = system.runSchedule(async () => {
            try {
                await DIMENSIONS.overworld.runCommandAsync(`testfor @a`);
                system.clearRunSchedule(s);
                resolve();
            }
            catch (error) { }
        }, 5);
    });
}
export function splitString(str, maxLength, subArraysMaxLength) {
    const subStrings = [];
    for (let i = 0; i < str.length; i += maxLength) {
        subStrings.push(str.slice(i, i + maxLength));
    }
    const subArrays = [];
    for (const subString of subStrings) {
        subArrays.push(Array.from({ length: Math.ceil(subString.length / subArraysMaxLength) }, (_, i) => subString.slice(i * subArraysMaxLength, (i + 1) * subArraysMaxLength)));
    }
    return subArrays;
}
export function joinStringArrays(strArrays) {
    return strArrays.reduce((acc, cur) => acc + cur.join(""), "");
}
