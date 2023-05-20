import { Database } from "./SmellyDB/Database";
import { EntitiesLoad } from "./SmellyDB/events/EntitiesLoad";
import { ItemStack, ItemTypes, world } from '@minecraft/server';
var db;
function jsonToItem(json) {
    const item = new ItemStack(ItemTypes.get(json.id ?? 'minecraft:air'), json.amount ?? 1);
    if (!("id" in json))
        return item;
    if ("name" in json)
        item.nameTag = json.name;
    if ("lore" in json)
        item.setLore(json.lore);
    return item;
}
function itemToJson(item) {
    const returnObject = {};
    if (item?.nameTag)
        returnObject["name"] = item.nameTag;
    if (item?.typeId)
        returnObject['id'] = item.typeId;
    if (item?.getLore())
        returnObject['lore'] = item.getLore();
    if (item?.amount)
        returnObject['amount'] = item.amount;
    return returnObject;
}
export async function createShopItem(itemStack, creator) {
    let item = itemToJson(itemStack);
    console.warn(JSON.stringify(item));
    creator.getComponent('inventory').container.addItem(jsonToItem(item));
}
EntitiesLoad.subscribe(async () => {
    try {
        db = new Database("Shop");
        for (const player of world.getPlayers()) {
        }
    }
    catch (e) {
        console.warn("§cFailed to load shop API!\n" + e);
    }
});
