import { Database } from "./SmellyDB/Database";
import { EntitiesLoad } from "./SmellyDB/events/EntitiesLoad";
// import './proceduralGeneration'
// @ts-ignore
import {ItemStack, Enchantment, ItemTypes, world} from '@minecraft/server';
var db;

function jsonToItem(json) {
    const item = new ItemStack(ItemTypes.get(json.id ?? 'minecraft:air'), json.amount ?? 1)
    if (!("id" in json)) return item
    if ("name" in json) item.nameTag = json.name
    if ("lore" in json) item.setLore(json.lore)
    // if (json.enchants) {
    //     const enchComp = item.getComponent('enchantments')
    //     const enchList = enchComp.enchantments
    //     for (const ench of json.enchants) {
    //         enchList.addEnchantment(new Enchantment(EnchantmentTypes[ench.id], ench.level))
    //     }
    //     enchComp.enchantments = enchList
    // }
    return item
}

function itemToJson(item) {
    /**
     * @type {{name?: string, lore?: string[], id?: string, amount?: number, data?: number, enchants?: {id: string, level: number}[]}}
     */
    const returnObject = {}
    if (item?.nameTag) returnObject["name"] = item.nameTag
    if (item?.typeId) returnObject['id'] = item.typeId;
    if (item?.getLore()) returnObject['lore'] = item.getLore()
    if (item?.amount) returnObject['amount'] = item.amount
    // if (item?.data) returnObject['data'] = item.data
    // if (item.hasComponent('enchantments')) for (const _ench in EnchantmentTypes) {
    //     const ench = item.getComponent('enchantments').enchantments.getEnchantment(EnchantmentTypes[_ench])
    //     if (!ench) continue
    //     const e = returnObject['enchants'] ?? []
    //     e.push({ id: ench.type.id, level: ench.level })
    //     returnObject['enchants'] = e
    // }
    return returnObject
}

export async function createShopItem(itemStack, creator) {
    let item = itemToJson(itemStack);
    console.warn(JSON.stringify(item))
    creator.getComponent('inventory').container.addItem(jsonToItem(item));
}

EntitiesLoad.subscribe(async()=>{
    try {
        db = new Database("Shop");
        for(const player of world.getPlayers()) {
            // createShopItem(player.getComponent('inventory').container.getItem(player.selectedSlot), player);
        }
    } catch(e) {
        console.warn("§cFailed to load shop API!\n"+e);
    }
})