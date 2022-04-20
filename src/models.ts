import moment from "moment";
import { MONTHS } from "./constants";
import * as currencyUtils from "./currencyUtils";
import { newMoment } from "./dateUtils";

export class Account {
    constructor(public id, public name, public balance) {
    }
    toString() {
        return this.name+": "+currencyUtils.prettyMoney(this.balance)
    }
}

export class Category {
    constructor(public id, public name, public balance) {
    }
}

export class CategoryTally {
    constructor(public id, public amount=0) {
    }
}


export class Schedule {
    getOccurrencesBetween(start,end) {}
}

export class XPerMonthSchedule extends Schedule {
    startDate;
    endDate;
    monthDays;

    constructor(public frequencyPerMonth, startDate, endDate?) {
        super();
        this.frequencyPerMonth = frequencyPerMonth;
        this.startDate = newMoment(startDate);
        this.endDate = endDate? newMoment(endDate) : null;
        this.monthDays = []
        let dayIval = Math.floor(30/this.frequencyPerMonth);
        let offset = Math.min(30,this.startDate.date()) % dayIval;
        for (let day = offset; day <= 30; day += dayIval) {
            if (day !== 0) this.monthDays.push(day)
        }
    }

    getOccurrencesBetween(start,finish) {
        let date = newMoment(start)
        let end = newMoment(finish)

        if (end.isBefore(this.startDate) || this.endDate?.isBefore(date)) return [];
        if (date.isBefore(this.startDate)) date = moment(this.startDate);
        if (this.endDate && this.endDate.isBefore(end)) moment(end = this.endDate);

        let occurrences: any[] = [];

        // For every month between start and end
        while (date.isSameOrBefore(end)) {
            this.monthDays.forEach(day=>{
                // Catch invalid February days
                // BUG: does not account for leap years
                if (date.month()===MONTHS.FEB && day > 28) day = 28;
                let occurrence = newMoment(date).date(day);
                if (occurrence.isSameOrBefore(end) && date.isSameOrBefore(occurrence)) {
                    occurrences.push(occurrence);
                }
            })
            date.date(1);
            date = date.add(1, 'M')
        }

        return occurrences;
    }
}

export class OneTimeSchedule extends Schedule {
    date;

    constructor(date) {
        super();
        this.date = newMoment(date);
    }

    getOccurrencesBetween(start,end) {
        start = newMoment(start)
        end = newMoment(end)

        if (end.isBefore(this.date) || this.date.isBefore(start)) return [];
        else return [this.date];
    }
}

//  NOT SURE THIS WILL BE USED YET. IT NEEDS SOME TESTING TO MAKE SURE IT WORKS
// export class EveryXMonthSchedule extends Schedule {
//     constructor(monthIval, startDate, endDate) {
//         super();
//         this.frequencyPerMonth = monthIval;
//         this.startDate = newMoment(startDate);
//         this.monthDay = Math.min(30,this.startDate.date())
//         this.endDate = endDate? newMoment(endDate) : null;
//     }

//     getOccurrencesBetween(date,end) {
//         date = newMoment(date)
//         end = newMoment(end)

//         if (end.isBefore(this.startDate) || this.endDate?.isBefore(date)) return [];

//         if (date.isBefore(this.startDate)) date = this.startDate;
//         if (this.endDate && this.endDate.isBefore(end)) end = this.endDate;

//         let occurrences = [];

//         // If our start date month day is before the recurring monthdate,
//         // bump it up. If it is after, bump it to the next month
//         if (date.date() > this.monthDay) date.add(1, "M")
//         date.date(this.monthDay);

//         // If our start date does not fall on an interval month,
//         // bump it up to the next one.
//         let offset = day2.diff(start, 'M')%this.monthIval
//         if (offset !== 0) day2.add(this.monthIval-offset, 'M')

//         // For every month between start and end
//         while (date.isSameOrBefore(end)) {
//             occurrences.push(newMoment(date));
//             date = date.add(this.monthIval, 'M')
//         }

//         return occurrences;
//     }
// }

export enum TransactionType {
    "Income",
    "Expense",
    "Transfer",
}

export enum FrequencyType {
    "Once",
    "PerMonth"
};

export class TransactionTemplate {
    constructor(public type:TransactionType, public memo: string, public amount: number, public targetAccount:string, public originAccount?:string, public categoryId?:string) {
    }
}

export class TransactionSchedule {
    constructor(public id, public template, public schedule) {
    }
}

export class TransactionEvent {
    constructor(public details, public date) {
    }
}

/** A structure that holds all computed transactions for easy access */
//  UNFINISHED!!!
// export class Forecast {
//     map;
//     list;
//     NearestUnder;
//     NearestAbove;
//     array;

//     constructor() {
//         this.map = new Map(); // <id, idx>
//         this.list = [];
//         this.NearestUnder = "NearestUnder"
//         this.NearestAbove = "NearestAbove"
//     }
    
//     addNextInOrder(snapshot) {
//         this.array.push(snapshot);
//         this.map.set(snapshot.id, this.array.length-1)
//     }

//     getById(id) {
//         return this.array[this.map.get(id)];
//     }
// 
    // getSnapshotAtDate(date) {
    //     date = newMoment(date);
    //     this.findNearDate(date, this.NearestUnder)
    // }

    // findNearDate(date, mode) {
    //     function helper (low, high) {
    //         if (low > high) {
    //             return null
    //         }
    //         let middle = Math.floor((low + high) / 2)
    //         const snapshot = this.array[middle];
    //         if (snapshot.event.date.isSame(date)) {
    //            return snapshot;
    //         }
    //         if (mode === this.NearestUnder) {
    //             if (snapshot.date.isBefore(date)) {
    //                 return helper(middle + 1, high)
    //             }
    //             return helper(low, middle - 1)
    //         }
    //     }
    //     return helper(0, arr.length - 1)
    //     getHigher
    //     if (!idx) idx = Math.floor(this.array.length/2)
    //     let snapshot = this.array[idx];
    //     if (snapshot.event.date.isSame(date)) return snapshot;

    //     if (mode == this.NearestUnder) {
    //         if (snapshot.date.isAfter(date)) {
    //             if (idx === this.array.length) {
    //                 return null
    //             }

    //         }
    //         else {
    //             let greater
    //         }
    //     }
    // }
// }

export class Snapshot {
    constructor(public balances, public mostRecentEvent) {
    }
}

export class MonthSummary {
    id;
    date;
    snapshots: Snapshot[] = [];
    report = {
        accountChanges: new Map(),
        totalExpense: 0,
        totalIncome: 0,
        netGrowth: 0
    };
    
    constructor(date, public initialBalances = new Map()) {
        this.date = newMoment(date);
        this.id = this.date.format("YYYY-MM")
        
        for (let acct of initialBalances.values()) {
            this.report.accountChanges.set(acct.id, {
                totalExpense: 0,
                totalIncome: 0,
                netGrowth: 0
            })
        }
    }

    addSnapshot(snapshot: Snapshot) {
        this.snapshots.push(snapshot);
        let details = snapshot.mostRecentEvent.details;
        let changes = this.report.accountChanges.get(details.targetAccount);
        if (details.type === TransactionType.Income) {
            changes.totalIncome += details.amount
            this.report.totalIncome += details.amount
        }
        else if (details.type === TransactionType.Expense) {
            changes.totalExpense += details.amount;
            this.report.totalExpense += details.amount;
        }
        changes.netGrowth = changes.totalIncome - changes.totalExpense;
        this.report.netGrowth = this.report.totalIncome - this.report.totalExpense;
    }

    printReport() {
        console.log("\n----- "+this.date.format("MMM, YYYY")+" -----")
        console.log("Income: "+currencyUtils.prettyMoney(this.report.totalIncome))
        console.log("Expense: "+currencyUtils.prettyMoney(this.report.totalExpense))
        let sign = this.report.netGrowth > 0 ? '💹' : '🔻'
        console.log("Growth: "+sign+" "+currencyUtils.prettyMoney(this.report.netGrowth))
        
        console.log("End Balance:")
        for (let acct of this.getEndBalances().values()){
            let msg = acct.balance < 0 ? '🔴 NEGATIVE BALANCE !!!' : ''
            console.log("  "+acct.toString()+msg);
        }
    }

    getEndBalances() {
        return this.snapshots[this.snapshots.length-1].balances;
    }

    toString() {

    }

}
