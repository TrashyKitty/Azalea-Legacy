
// @ts-ignore
import {
  DynamicPropertiesDefinition,
  EntityTypes,
  world,
  // @ts-ignore
} from "@minecraft/server";
import { ENTITY_IDENTIFIER, ENTITY_LOCATION } from "./config/database";
import { DIMENSIONS } from "./utils.js";

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  /**
   * Loads Ticking Area
   */
  try {
    DIMENSIONS.overworld.runCommandAsync(
      `tickingarea add ${ENTITY_LOCATION.x} ${ENTITY_LOCATION.y} ${ENTITY_LOCATION.z} ${ENTITY_LOCATION.x} ${ENTITY_LOCATION.y} ${ENTITY_LOCATION.z} db true`
    );
  
  } catch {

  }
  let def = new DynamicPropertiesDefinition();
  def.defineString("tableName", 30);
  def.defineNumber("index");
  propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    EntityTypes.get(ENTITY_IDENTIFIER)
  );
});
