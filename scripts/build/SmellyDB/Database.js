import { ItemStack, MinecraftItemTypes } from "@minecraft/server";
import { BACKUP_NAME, ENTITY_IDENTIFIER, ENTITY_LOCATION, INVENTORY_SIZE, MAX_DATABASE_STRING_SIZE, MAX_LORE_ARRAY_SIZE, } from "./config/database";
import { DIMENSIONS, splitString } from "./utils";
import { EntitiesLoad } from "./events/EntitiesLoad";
export class Database {
    tableName;
    static createTableEntity(tableName, index) {
        const entity = DIMENSIONS.overworld.spawnEntity(ENTITY_IDENTIFIER, ENTITY_LOCATION);
        entity.setDynamicProperty("tableName", tableName);
        entity.nameTag = `§aDatabase Table: ${tableName}§r`;
        if (index)
            entity.setDynamicProperty("index", index);
        return entity;
    }
    static getTableEntities(tableName) {
        return DIMENSIONS.overworld
            .getEntitiesAtBlockLocation(ENTITY_LOCATION)
            .filter((e) => e.typeId == ENTITY_IDENTIFIER &&
            e.getDynamicProperty("tableName") == tableName);
    }
    static despawnTableEntities() {
        return DIMENSIONS.overworld
            .getEntitiesAtBlockLocation(ENTITY_LOCATION)
            .map((e) => e.triggerEvent("despawn"));
    }
    MEMORY;
    QUEUE;
    constructor(tableName) {
        this.tableName = tableName;
        this.tableName = tableName;
        this.MEMORY = {};
        this.QUEUE = [];
        EntitiesLoad.subscribe(async () => {
            await this.initData();
            this.QUEUE.forEach((v) => v());
        });
    }
    async addQueueTask() {
        return new Promise((resolve) => {
            this.QUEUE.push(resolve);
        });
    }
    async saveData() {
        if (!this.MEMORY)
            await this.addQueueTask();
        let entities = Database.getTableEntities(this.tableName);
        let chunks = splitString(JSON.stringify(this.MEMORY), MAX_DATABASE_STRING_SIZE, MAX_LORE_ARRAY_SIZE);
        const entitiesNeeded = Math.ceil(chunks.length / INVENTORY_SIZE) - entities.length;
        if (entitiesNeeded > 0) {
            for (let i = 0; i < entitiesNeeded; i++) {
                entities.push(Database.createTableEntity(this.tableName));
            }
        }
        let savedChunks = 0;
        let i = 0;
        while (savedChunks < chunks.length) {
            const entity = entities[i];
            if (!entity)
                continue;
            const inventory = entity.getComponent("inventory").container;
            inventory.clearAll();
            for (let j = 0; j < inventory.size && savedChunks < chunks.length; j++) {
                const chunk = chunks[savedChunks];
                let item = new ItemStack(MinecraftItemTypes.acaciaBoat);
                item.setLore(chunk);
                inventory.setItem(j, item);
                savedChunks++;
            }
            entity.setDynamicProperty("index", i);
            i++;
        }
        entities.slice(i).forEach((e) => e?.triggerEvent("despawn"));
        DIMENSIONS.overworld.runCommandAsync(`structure save ${BACKUP_NAME} ${ENTITY_LOCATION.x} ${ENTITY_LOCATION.y} ${ENTITY_LOCATION.z} ${ENTITY_LOCATION.x} ${ENTITY_LOCATION.y} ${ENTITY_LOCATION.z} disk`);
    }
    async initData() {
        let entities = Database.getTableEntities(this.tableName).sort((a, b) => a.getDynamicProperty("index") -
            b.getDynamicProperty("index"));
        console.warn(`entities length ${entities.length}`);
        if (entities.length == 0) {
            console.warn(`[Database-Warning]: No data found for table ${this.tableName}!`);
            console.warn(`[Database-Warning]: Attempting to load backed-up data.`);
            Database.despawnTableEntities();
            try {
                await DIMENSIONS.overworld.runCommandAsync(`structure load ${BACKUP_NAME} ${ENTITY_LOCATION.x} ${ENTITY_LOCATION.y} ${ENTITY_LOCATION.z}`);
                let backedUpEntities = Database.getTableEntities(this.tableName);
                if (backedUpEntities.length == 0)
                    throw new Error("No Entities found");
                console.warn(`[Database-Success]: Back-up data successfully loaded for ${this.tableName}!`);
                entities = Database.getTableEntities(this.tableName).sort((a, b) => a.getDynamicProperty("index") -
                    b.getDynamicProperty("index"));
            }
            catch (error) {
                console.warn(`[Database-Warning]: Failed to load back-up data for ${this.tableName}!`, error);
            }
        }
        const stringifiedData = [];
        for (const entity of entities) {
            const inventory = entity.getComponent("inventory").container;
            for (let i = 0; i < inventory.size; i++) {
                const item = inventory.getItem(i);
                if (item)
                    stringifiedData.push(...item.getLore());
            }
        }
        this.MEMORY = JSON.parse(stringifiedData.join("") || "{}");
        return this.MEMORY;
    }
    async set(key, value) {
        this.MEMORY[key] = value;
        return this.saveData();
    }
    get(key) {
        if (!this.MEMORY)
            throw new Error("Entities not loaded! Consider using `getAsync` instead!");
        return this.MEMORY[key];
    }
    async getSync(key) {
        if (this.MEMORY)
            return this.get(key);
        await this.addQueueTask();
        return this.MEMORY[key];
    }
    keys() {
        if (!this.MEMORY)
            throw new Error("Entities not loaded! Consider using `keysSync` instead!");
        return Object.keys(this.MEMORY);
    }
    async keysSync() {
        if (this.MEMORY)
            return this.keys();
        await this.addQueueTask();
        return Object.keys(this.MEMORY);
    }
    values() {
        if (!this.MEMORY)
            throw new Error("Entities not loaded! Consider using `valuesSync` instead!");
        return Object.values(this.MEMORY);
    }
    async valuesSync() {
        if (this.MEMORY)
            return this.values();
        await this.addQueueTask();
        return Object.values(this.MEMORY);
    }
    has(key) {
        if (!this.MEMORY)
            throw new Error("Entities not loaded! Consider using `hasSync` instead!");
        return Object.keys(this.MEMORY).includes(key);
    }
    async hasSync(key) {
        if (this.MEMORY)
            return this.has(key);
        await this.addQueueTask();
        return Object.keys(this.MEMORY).includes(key);
    }
    collection() {
        if (!this.MEMORY)
            throw new Error("Entities not loaded! Consider using `collectionSync` instead!");
        return this.MEMORY;
    }
    async collectionSync() {
        if (this.MEMORY)
            return this.collection();
        await this.addQueueTask();
        return this.MEMORY;
    }
    async delete(key) {
        const status = delete this.MEMORY[key];
        await this.saveData();
        return status;
    }
    async clear() {
        this.MEMORY = {};
        return await this.saveData();
    }
}
