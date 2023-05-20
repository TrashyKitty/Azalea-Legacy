import { Warp } from "./warp";
const warp = new Warp();
export const WarpCommand = {
    name: 'warp',
    description: 'Warps!',
    aliases: ['w', 'wtp'],
    exec(msg, args) {
        let tpArgs = ['teleport', 'tp', 'warp', '-t', '-w'];
        let setArgs = ['add', 'set', 'create', 'make', '-a', '-c', '-m'];
        let delArgs = ['remove', 'del', 'delete', 'destroy', '-d', '-r'];
        let listArgs = ['print', 'list', '-l', 'l'];
        if (tpArgs.includes(args[0])) {
            try {
                let w = warp.get(args.slice(1).join(' '));
                warp.tp(msg.sender, w);
            }
            catch {
                msg.sender.sendMessage('§cThis warp either doesnt exist or an error occurred.');
            }
        }
        else if (setArgs.includes(args[0])) {
            warp.set(args.slice(1).join(' '), msg.sender.location.x, msg.sender.location.y, msg.sender.location.z, msg.sender.dimension, false);
            msg.sender.sendMessage('§dSet warp: §a' + args.slice(1).join(' '));
        }
        else if (delArgs.includes(args[0])) {
            try {
                warp.remove(args.slice(1).join(' '));
                msg.sender.sendMessage('§dRemoved warp: §a' + args.slice(1).join(' '));
            }
            catch {
                msg.sender.sendMessage('§cThis warp either doesnt exist or an error occurred.');
            }
        }
        else if (listArgs.includes(args[0]) || !args.length) {
            let warps = warp.list();
            if (warps.length) {
                msg.sender.sendMessage(`§6<-=-=- §3Warps §6-=-=->\n§d${warps.join('\n§d')}`);
            }
            else {
                msg.sender.sendMessage('§6The admins have not set any warps yet!');
            }
        }
        else {
            try {
                let w = warp.get(args.join(' '));
                warp.tp(msg.sender, w);
            }
            catch {
                msg.sender.sendMessage('§cThis warp either doesnt exist or an error occurred.');
            }
        }
    }
};
