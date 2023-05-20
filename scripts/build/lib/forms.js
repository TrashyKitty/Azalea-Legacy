import { Player, world } from "@minecraft/server";
import { ModalFormData, ActionFormData, ActionFormResponse, ModalFormResponse, MessageFormData, MessageFormResponse, FormCancelationReason } from "@minecraft/server-ui";
export const content = {
    warn(...messages) {
        console.warn(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? '<f>' : value)).join(' '));
    },
    chatFormat(...messages) {
        world.say(messages.map(message => JSON.stringify(message, (key, value) => (value instanceof Function) ? value.toString().replaceAll('\r\n', '\n') : value, 4)).join(' '));
    }
};
function isNumberDefined(input) {
    return (input !== false && input !== null && input !== undefined && input !== NaN && input !== Infinity);
}
export class MessageForm {
    constructor() {
        this.form = new MessageFormData();
        this.callbacks = [null, null];
    }
    title(titleText) {
        if (typeof titleText !== 'string')
            throw new Error(`titleText: ${titleText}, at params[0] is not a String!`);
        this.form.title(titleText);
        return this;
    }
    body(bodyText) {
        if (typeof bodyText !== 'string')
            throw new Error(`bodyText: ${titleText}, at params[0] is not a String!`);
        this.form.body(bodyText);
        return this;
    }
    button1(text, callback) {
        if (typeof text !== 'string')
            throw new Error(`text: ${label}, at params[0] is not a String!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[1] is defined and is not a Function!`);
        this.callbacks[1] = callback;
        this.form.button1(text);
        return this;
    }
    button2(text, callback) {
        if (typeof text !== 'string')
            throw new Error(`text: ${label}, at params[0] is not a String!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[1] is defined and is not a Function!`);
        this.callbacks[0] = callback;
        this.form.button2(text);
        return this;
    }
    async show(player, awaitNotBusy = false, callback) {
        try {
            if (!(player instanceof Player))
                player = player?.player;
            if (!(player instanceof Player))
                throw new Error(`player at params[0] is not a Player!`);
            if (awaitNotBusy && typeof awaitNotBusy !== 'boolean')
                throw new Error(`awaitNotBusy at params[1] is not a Boolean!`);
            if (callback && !(callback instanceof Function))
                throw new Error(`callback at params[2] is not a Function!`);
            let response;
            while (true) {
                response = await this.form.show(player);
                const { cancelationReason } = response;
                if (!awaitNotBusy || cancelationReason !== 'userBusy')
                    break;
            }
            const { selection } = response;
            const callbackIndex = this.callbacks[selection];
            if (callbackIndex instanceof Function)
                callbackIndex(player, selection);
            if (callback instanceof Function)
                callback(player, response);
            return response;
        }
        catch (error) {
            console.log(error, error.stack);
        }
    }
}
export class ActionForm {
    constructor() {
        this.form = new ActionFormData();
        this.callbacks = [];
    }
    title(titleText) {
        if (typeof titleText !== 'string')
            throw new Error(`titleText: ${titleText}, at params[0] is not a String!`);
        this.form.title(titleText);
        return this;
    }
    body(bodyText) {
        if (typeof bodyText !== 'string')
            throw new Error(`bodyText: ${titleText}, at params[0] is not a String!`);
        this.form.body(bodyText);
        return this;
    }
    button(text, iconPath, callback) {
        if (typeof text !== 'string')
            throw new Error(`text: ${label}, at params[0] is not a String!`);
        if (iconPath && typeof iconPath !== 'string')
            throw new Error(`iconPath: ${defaultValue}, at params[1] is defined and is not a String!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[2] is defined and is not a Function!`);
        this.callbacks.push(callback);
        this.form.button(text, iconPath);
        return this;
    }
    async show(player, awaitNotBusy = false, callback) {
        try {
            if (!(player instanceof Player))
                player = player?.player;
            if (!(player instanceof Player))
                throw new Error(`player at params[0] is not a Player!`);
            if (awaitNotBusy && typeof awaitNotBusy !== 'boolean')
                throw new Error(`awaitNotBusy at params[1] is not a Boolean!`);
            if (callback && !(callback instanceof Function))
                throw new Error(`callback at params[2] is not a Function!`);
            let response;
            while (true) {
                response = await this.form.show(player);
                const { cancelationReason } = response;
                if (!awaitNotBusy || cancelationReason !== 'userBusy')
                    break;
            }
            const { selection } = response;
            const callbackIndex = this.callbacks[selection];
            if (callbackIndex instanceof Function)
                callbackIndex(player, selection);
            if (callback instanceof Function)
                callback(player, response);
            return response;
        }
        catch (error) {
            console.log(error, error.stack);
        }
    }
}
export class ModalForm {
    constructor() {
        this.form = new ModalFormData();
        this.callbacks = [];
    }
    title(titleText) {
        if (typeof titleText !== 'string')
            throw new Error(`titleText: ${titleText}, at params[0] is not a String!`);
        this.form.title(titleText);
        return this;
    }
    toggle(label, defaultValue, callback) {
        if (typeof label !== 'string')
            throw new Error(`label: ${label}, at params[0] is not a String!`);
        if (defaultValue && typeof defaultValue !== 'string')
            throw new Error(`defaultValue: ${defaultValue}, at params[1] is defined and is not a String!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[2] is defined and is not a Function!`);
        this.callbacks.push(callback);
        this.form.toggle(label, defaultValue);
        return this;
    }
    dropdown(label, options, defaultValueIndex = 0, callback) {
        if (typeof label !== 'string')
            throw new Error(`label: ${label}, at params[0] is not a String!`);
        if (!(options instanceof Array))
            throw new Error(`params[1] is not an Array!`);
        options.forEach((object, i) => { if (!(object instanceof Object))
            throw new Error(`index: ${i}, in params[1] is not an Object!`); });
        const optionStrings = options.map(({ option }, i) => { if (typeof option !== 'string')
            throw new Error(`property option: ${option}, at index: ${i}, in params[1] is not a String!`); return option; });
        const optionCallbacks = options.map(({ callback }) => { if (callback && !(callback instanceof Function))
            throw new Error(`property callback at index: ${i}, in params[1] is not a Function!`);
        else if (callback)
            return callback; });
        if (!isNumberDefined(defaultValueIndex) && !Number.isInteger(defaultValueIndex))
            throw new Error(`defaultValueIndex: ${defaultValueIndex}, at params[2] is defined and is not an Integer!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[3] is defined and is not a Function!`);
        this.callbacks.push([optionCallbacks, callback]);
        this.form.dropdown(label, optionStrings, defaultValueIndex);
        return this;
    }
    slider(label, minimumValue, maximumValue, valueStep, defaultValue = null, callback) {
        if (typeof label !== 'string')
            throw new Error(`label: ${label}, at params[0] is not a String!`);
        if (typeof minimumValue !== 'number')
            throw new Error(`minimumValue: ${minimumValue}, at params[1] is not a Number!`);
        if (typeof maximumValue !== 'number')
            throw new Error(`maximumValue: ${maximumValue}, at params[2] is not a Number!`);
        if (typeof valueStep !== 'number')
            throw new Error(`valueStep: ${valueStep}, at params[3] is not a Number!`);
        if (!isNumberDefined(defaultValue) && typeof defaultValue !== 'number')
            throw new Error(`defaultValue: ${defaultValue}, at params[4] is defined and is not a Number!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[5] is defined and is not a Function!`);
        this.callbacks.push(callback);
        this.form.slider(label, minimumValue, maximumValue, valueStep, defaultValue);
        return this;
    }
    textField(label, placeholderText, defaultValue = null, callback) {
        if (typeof label !== 'string')
            throw new Error(`label: ${label}, at params[0] is not a String!`);
        if (typeof placeholderText !== 'string')
            throw new Error(`placeholderText: ${placeholderText}, at params[1] is not a String!`);
        if (defaultValue && typeof defaultValue !== 'string')
            throw new Error(`defaultValue: ${defaultValue}, at params[2] is defined and is not a String!`);
        if (callback && !(callback instanceof Function))
            throw new Error(`callback at params[3] is defined and is not a Function!`);
        this.callbacks.push(callback);
        this.form.textField(label, placeholderText, defaultValue);
        return this;
    }
    ;
    async show(player, awaitNotBusy = false, callback) {
        try {
            if (!(player instanceof Player))
                player = player?.player;
            if (!(player instanceof Player))
                throw new Error(`player at params[0] is not a Player!`);
            if (awaitNotBusy && typeof awaitNotBusy !== 'boolean')
                throw new Error(`awaitNotBusy at params[1] is not a Boolean!`);
            if (callback && !(callback instanceof Function))
                throw new Error(`callback at params[2] is not a Function!`);
            let response;
            while (true) {
                response = await this.form.show(player);
                const { cancelationReason } = response;
                if (!awaitNotBusy || cancelationReason !== 'userBusy')
                    break;
            }
            const { formValues, cancelationReason } = response;
            if (cancelationReason !== FormCancelationReason.userClosed
                && cancelationReason !== FormCancelationReason.userBusy)
                formValues.forEach((value, i) => {
                    if (this.callbacks[i] instanceof Array) {
                        const callback = this.callbacks[i][0];
                        const callbackAll = this.callbacks[i][1];
                        if (callback instanceof Function)
                            callback(player, i);
                        if (callbackAll instanceof Function)
                            callbackAll(player, value, i);
                    }
                    else {
                        const callback = this.callbacks[i];
                        if (callback instanceof Function)
                            callback(player, value, i);
                    }
                });
            if (callback instanceof Function)
                callback(player, response);
            return response;
        }
        catch (error) {
            console.warn(error, error.stack);
        }
    }
}
