import { Account } from "./models/Account";
import { TransactionSchedule } from "./models/transactions/TransactionSchedule";
import { TransactionTemplate } from "./models/transactions/TransactionTemplate";
import { TransactionType } from "./models/transactions/TransactionType";
import { OneTimeSchedule } from "./models/schedules/OneTimeSchedule";
import { XPerMonthSchedule } from "./models/schedules/XPerMonthSchedule";
import { MONTHS } from "./utils/constants";
import { newMoment } from "./utils/dateUtils";
import ForecastService from "./services/forecastService";
import moment from "moment";
import { ForecastTree } from "./models/Forecast";
import { Snapshot } from "./models/Snapshot";
import { TransactionEvent } from "./models/transactions/TransactionEvent";

let accounts = {
    afcu_checking: new Account("1", "AFCU Checking", 500),
    afcu_savings: new Account("2", "AFCU Savings", 5500),
    rothIra: new Account("3", "ROTH IRA", 6500),
    hsa: new Account("5", "HSA", 0),
    us_savings: new Account("4", "US Bank", 22000),
};

let initialAccounts = Object.values(accounts);

let scheduledTransactions = [
    /**
     * EVERY MONTH
     */
    new TransactionSchedule( // Groceries
        "Groceries",
        new TransactionTemplate(TransactionType.Expense,"Groceries",300, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2021,MONTHS.APR,25))
    ),
    new TransactionSchedule( // Groceries
        "Baby",
        new TransactionTemplate(TransactionType.Expense,"Baby Care",50, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2021,MONTHS.APR,25))
    ),
    new TransactionSchedule( // Car Insurance
        "CarIns",
        new TransactionTemplate(TransactionType.Expense,"Car Insurance",81, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2021,MONTHS.APR,8))
    ),
    new TransactionSchedule(
        "Fuel",
        new TransactionTemplate(TransactionType.Expense,"Fuel", 50, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2021,MONTHS.APR,8))
    ),
    new TransactionSchedule( // Fun Money
        "Fun",
        new TransactionTemplate(TransactionType.Expense,"Fun Money",150, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2021,MONTHS.APR,25))
    ),
  
    new TransactionSchedule( // Clozd fulltime
        "Full",
        new TransactionTemplate(TransactionType.Income,"Full TIme Salary",2712.5, accounts.afcu_checking.id),
        new XPerMonthSchedule(2, new Date(2022,MONTHS.MAY,14))
    ),
    new TransactionSchedule(
        "Tithing",
        new TransactionTemplate(TransactionType.Expense,"Tithing",542.5, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,28))
    ),
    new TransactionSchedule(
        "Fast Offering",
        new TransactionTemplate(TransactionType.Expense,"Fast Offering",100, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY, 7))
    ),

    /**
     * HOME PURCHASE
     */
    new TransactionSchedule(
        "Down",
        new TransactionTemplate(TransactionType.Expense,"Down Payment",10000, accounts.us_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.MAY,5))
    ),
    new TransactionSchedule(
        "Closing",
        new TransactionTemplate(TransactionType.Expense,"Closing Costs",10000, accounts.us_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.MAY,5))
    ),


    
    new TransactionSchedule(
        "Subaru",
        new TransactionTemplate(TransactionType.Income,"Sell SUbaru",3000, accounts.us_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.MAY,20))
    ),
 
    
    /**
     * EVERY MONTH starting June
     */
    new TransactionSchedule(
        "Mortgage",
        new TransactionTemplate(TransactionType.Expense,"Mortgage",2183, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.JUN,5))
    ),
    new TransactionSchedule(
       "HOA",
       new TransactionTemplate(TransactionType.Expense,"HOA",215, accounts.afcu_checking.id),
       new XPerMonthSchedule(1, new Date(2022,MONTHS.JUN,5))
   ),
    new TransactionSchedule(
        "Utilities",
        new TransactionTemplate(TransactionType.Expense,"Utilities",175, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.JUN,28))
    ),
    new TransactionSchedule(
        "Home Insurance",
        new TransactionTemplate(TransactionType.Expense,"Home Insurance",30, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.JUN,8))
    ),
    
    new TransactionSchedule(
        "Health Insurance",
        new TransactionTemplate(TransactionType.Expense,"Health Insurance",188, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.JUN,30))
    ),



    /**
     * SAVINGS AFTER MAY
     */
    new TransactionSchedule(
        "Car",
        new TransactionTemplate(TransactionType.Transfer,"New Car Fund", 250, accounts.us_savings.id, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,30))
    ),
    new TransactionSchedule(
        "roth",
        new TransactionTemplate(TransactionType.Transfer,"RothIRA Fund", 325, accounts.rothIra.id, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,30))
    ),
    new TransactionSchedule(
        "roth-clozd",
        new TransactionTemplate(TransactionType.Transfer,"RothIRA Clozd", 162, accounts.rothIra.id, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,30))
    ),
    new TransactionSchedule(
        "Emergency",
        new TransactionTemplate(TransactionType.Transfer,"Emergency Fund", 600, accounts.afcu_savings.id, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,30))
    ),
    new TransactionSchedule(
        "clozdHSA",
        new TransactionTemplate(TransactionType.Income,"Clozd HSA Contribution", 158, accounts.hsa.id, accounts.afcu_checking.id),
        new XPerMonthSchedule(1, new Date(2022,MONTHS.MAY,30))
    ),



    /**
     * BIG ONE-TIMERS
     */

    new TransactionSchedule(
        "Register Car",
        new TransactionTemplate(TransactionType.Expense,"Register Car", 200, accounts.afcu_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.AUG,30))
    ),

    new TransactionSchedule(
        "LegoLand Trip",
        new TransactionTemplate(TransactionType.Expense,"LEGOLAND", 350, accounts.afcu_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.MAY,15))
    ),

    new TransactionSchedule(
        "sanfran",
        new TransactionTemplate(TransactionType.Expense,"San Francisco", 600, accounts.afcu_savings.id),
        new OneTimeSchedule(new Date(2022,MONTHS.JUN,15))
    ),



  ]


let forecast = ForecastService.computeForecast(initialAccounts, scheduledTransactions,
                    newMoment(Date.now()), moment().endOf('year'))

// for (let month of forecast) {
//     month.printReport();
// }


let forecastTest = new ForecastTree();
forecastTest.addNextInOrder(new Snapshot([], new TransactionEvent(scheduledTransactions[0].template, newMoment('2022-04-08'))))
forecastTest.addNextInOrder(new Snapshot([], new TransactionEvent(scheduledTransactions[0].template, newMoment('2022-04-10'))))
forecastTest.addNextInOrder(new Snapshot([], new TransactionEvent(scheduledTransactions[0].template, newMoment('2022-04-05'))))
console.log(forecastTest)
