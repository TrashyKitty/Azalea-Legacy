// @ts-ignore
import {world} from '@minecraft/server';

export class Economy {
    moneyScoreboard: string;
    ADD: 0;
    SUBTRACT: 1;
    DIVIDE: 2;
    MULTIPLY: 3;
    EXPONENT: 4;

    constructor() {
        this.ADD = 0;
        this.SUBTRACT = 1;
        this.DIVIDE = 2;
        this.MULTIPLY = 3;
        this.EXPONENT = 4;
        this.moneyScoreboard = "$money";
        try { world.scoreboard.addObjective(this.moneyScoreboard, '§aAZALEA MONEY SCOREBOARD'); }
        catch {}
    }

    retryAdd() {
        try { world.scoreboard.addObjective(this.moneyScoreboard, '§aAZALEA MONEY SCOREBOARD'); }
        catch {}
    }

    convertToSmall(num) {
        return num / Math.pow(10, num.toString().length);
    }

    convertToLarge(num) {
        return num * Math.pow(10, num.toString().substring(2).length);
    }

    getAmount(player) {
        let moneyScoreboard = world.scoreboard.getObjective(this.moneyScoreboard);
        return moneyScoreboard.getScore(player.scoreboardIdentity);
    }
    setAmount(player, num) {
        let moneyScoreboard = world.scoreboard.getObjective(this.moneyScoreboard);
        moneyScoreboard.setScore(player.scoreboardIdentity, num >= 0 ? Math.floor(num) : 0);
    }
    operationAmount(player, num, operation = 0) {
        let playerAmount = this.getAmount(player)
        let amount =
            operation == this.ADD ? playerAmount + num
            : operation == this.SUBTRACT ? playerAmount - num
            : operation == this.DIVIDE ? playerAmount / num
            : operation == this.MULTIPLY ? playerAmount * num
            : operation == this.EXPONENT ? playerAmount ** num
            : playerAmount + num;
        this.setAmount(
            player,
            amount
        )
    }
    addAmount(player, num) {
        this.operationAmount(player, num, this.ADD)
    }
    subtractAmount(player, num) {
        this.operationAmount(player, num, this.SUBTRACT)
    }
    divideAmount(player, num) {
        this.operationAmount(player, num, this.DIVIDE);
    }
    multiplyAmount(player, num) {
        this.operationAmount(player, num, this.MULTIPLY);
    }
    exponentialAmount(player, num) {
        this.operationAmount(player, num, this.EXPONENT);
    }
    percentageOfAmount(player, percentage) {
        let amount = this.getAmount(player);
        if(percentage > 100) percentage = 100;
        if(percentage < 0) percentage = 0;
        this.setAmount(player, amount * (percentage / 100));
    }
}