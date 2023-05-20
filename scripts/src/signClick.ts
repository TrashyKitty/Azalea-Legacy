// @ts-ignore
import * as minecraft from '@minecraft/server';
import { Database } from './db';
let signs = new Database(12);
minecraft.world.events.beforeItemUseOn.subscribe(eventData=>{
    let block = eventData.source.getBlockFromViewDirection({
        maxDistance: 5,
        includePassableBlocks: true,
        includeLiquidBlocks: false
    })
    if(!block.typeId.startsWith('minecraft:') && !block.typeId.endsWith('sign')) return;
    let signComponent = block.getComponent('sign');
    // console.warn(signComponent);
    // minecraft.world.sendMessage(signComponent.getText());
    let signText = signComponent.getText();
    function runSign(sign, source, signComponent?) {
        let data = sign.slice(0, -1).substring(1);
        let sections = data.split(', ');
        if(signComponent) {
            signComponent.setText(`§d§o`+sections[0])
            // signComponent.setWaxed(true);
        }
        source.runCommand(sections[1].startsWith('/') ? sections[1].substring(1) : sections[1]);
    }
    if(!signs.get(`${block.location.x}-${block.location.y}-${block.location.z}`)) {
        if(/\[([\s\S]*?)\]/.test(signComponent.getText())) {
            // signComponent.setWaxed(true);
            signs.set(`${block.location.x}-${block.location.y}-${block.location.z}`, signText);
            eventData.cancel = true;
            runSign(signText, eventData.source, signComponent)
        }
    } else {
        eventData.cancel = true;
        let sign = signs.get(`${block.location.x}-${block.location.y}-${block.location.z}`);
        runSign(sign, eventData.source, signComponent);
    }
});