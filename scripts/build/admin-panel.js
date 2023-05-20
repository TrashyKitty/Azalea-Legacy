import * as minecraft from '@minecraft/server';
import { ActionForm } from './lib/forms';
import { cache } from './cache';
cache.set('adminpanel', []);
(() => {
    let adminPanel = cache.get('adminpanel');
    adminPanel.push({
        name: "Test",
        description: "Test description",
        icon: null,
        exec(player, extra) {
        }
    });
    cache.set('adminpanel', adminPanel);
})();
minecraft.world.events.beforeItemUse.subscribe(eventData => {
    if (eventData.item.typeId != "minecraft:echo_shard")
        return;
    eventData.cancel = true;
    let form = new ActionForm();
    form.title("Admin panel!");
    form.body("Another admin panel redesign! Anyways, select an option.");
    let adminPanelItems = cache.get('adminpanel');
    for (const item of adminPanelItems) {
        console.warn(item);
        form.button(`${item.name}\n§8${item.description}`, item.icon, item.exec);
        console.warn("2");
    }
    form.show(eventData.source, false, res => {
    });
});
