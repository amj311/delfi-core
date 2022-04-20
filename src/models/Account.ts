import * as currencyUtils from "../utils/currencyUtils";


export class Account {
    constructor(public id, public name, public balance) {
    }
    toString() {
        return this.name + ": " + currencyUtils.prettyMoney(this.balance);
    }
}
