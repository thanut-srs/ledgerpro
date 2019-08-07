import { LocalNotifications } from '@ionic-native/local-notifications';
import { ModalController, Nav } from 'ionic-angular';
import { Injectable, ViewChild } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {
  @ViewChild(Nav) nav: Nav;
  public db: SQLiteObject;
  public result = [];
  public resultByID = [];
  public date = [];
  public loginFlag = null;
  public userPw = "";
  public userNickName = "";
  public uID = "";
  public currentBalance: number;
  public gTarget: any;
  public gAmount: any;
  constructor(
    public sqlite: SQLite,
    public modalCtrl: ModalController,
    public localNotifications: LocalNotifications,
  ) {
    console.log('Hello SqlProvider Provider');
  }

  async checkWallet(uID: string) {
    console.log('checkWallet uid is ', uID);
    return this.db.executeSql(`
    SELECT * FROM Wallet where uID = "`+ uID + `"
    `, [])
      .then((data) => {
        if (data.rows.length != 0) {
          console.log('YOU HAVE WALLETS!!!')
          return true
        } else {
          console.log('YOU HAVE NO WALLETS!!!')
          return false
        }
      });
  }

  async checkSingleWallet(uID: string) {
    console.log('checkWallet uid is ', uID);
    return this.db.executeSql(`
    SELECT * FROM Wallet where uID = "`+ uID + `"
    `, [])
      .then((data) => {
        if (data.rows.length == 1) {
          console.log('YOU HAVE 1 WALLETS!!!')
          return true
        } else {
          console.log('YOU HAVE MANY WALLETS!!!')
          return false
        }
      });
  }

  openDB() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      this.db = database;
    });
  }

  dropTables() {
    let tablesName = ["Users", "Transactions", "Wallet", "Session", "Goal"]
    for (let i = 0; i < tablesName.length; i++) {
      this.db.executeSql(`
      DROP TABLE `+ tablesName[i] + `;
      `, [])
        .then(() => console.log(tablesName[i] + ' is dropped!'))
        .catch(e => console.log(e));
    }
  }

  deleteRowById(tID: number) {
    this.db.executeSql(`
  DELETE FROM Transactions WHERE tID = `+ tID + `;
  `, [])
      .then(() => console.log('Delete transaction (tID: ' + tID + ')'))
      .catch(e => console.log(e));
  }

  async deleteWalletById(wID: number) {
    this.db.executeSql(`
  DELETE FROM Wallet WHERE wID = `+ wID + `;
  `, [])
      .then(() => {
        console.log('Delete wallet (wID: ' + wID + ')')
      })
      .catch(e => console.log(e));
  }

  async deleteTransactionBywName(wName: string) {
    console.log('Welcome to delete transaction by wallet name!!!!');
    console.log('Wallet name is ', wName);
    this.db.executeSql(`
  DELETE FROM Transactions WHERE walletName = "`+ wName + `";
  `, [])
      .then(() => console.log('Delete transaction (wID: ' + wName + ')'))
      .catch(e => console.log(e));
  }

  async deleteWallet(wID: number, wName: string) {
    await this.deleteWalletById(wID);
    await this.deleteTransactionBywName(wName);
  }

  deleteSession() {
    return this.db.executeSql(`
    DELETE FROM Session;
    VACUUM;
  `, [])
      .then(() => console.log('Delete session!'))
      .catch(e => console.log(e));
  }

  async selectTable() {
    console.log("Select Table (sql) #5");
    await this.selectTransactionTable();
    console.log('selectTable(sql) result is ', this.result)
    console.log("SelectTransactiontable is done (sql) #7");
    return this.result
  }

  async getWalletTable() {
    await this.selectWalletTable();
    return this.result
  }
  async selectWalletTable() {
    return this.db.executeSql(`
    SELECT * FROM Wallet 
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i).name;
          let balance = data.rows.item(i).balance;
          let uID = data.rows.item(i).uID;
          let wID = data.rows.item(i).wID;
          let resultObj = { name, balance, uID, wID };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async getWalletTableByID(wID: number) {
    await this.selectWalletTableByID(wID);
    return this.result
  }
  async selectWalletTableByID(wID: number) {
    return this.db.executeSql(`
    SELECT * FROM Wallet WHERE wID = `+ wID + `
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i).name;
          let balance = data.rows.item(i).balance;
          let resultObj = { name, balance };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async getGoal() {
    await this.selectGoalTable();
    return this.result
  }

  async selectGoalTable() {
    return this.db.executeSql(`
    SELECT * FROM Goal 
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let gID = data.rows.item(i).gID;
          let name = data.rows.item(i).name;
          let target = data.rows.item(i).target;
          let amount = data.rows.item(i).amount;
          let uID = data.rows.item(i).uID;
          let deadline = data.rows.item(i).deadline;
          let memo = data.rows.item(i).memo;
          let resultObj = { gID, name, target, amount, uID, deadline, memo };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async getGoalById(gID: number) {
    await this.selectGoalTableById(gID);
    console.log("result from getGoalById is ",this.result)
    return this.result
  }

  async selectGoalTableById(gID: number) {
    console.log("gID in selectGoalTableById is ",gID);
    return this.db.executeSql(`
    SELECT * FROM Goal WHERE gID = `+gID+`
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let gID = data.rows.item(i).gID;
          let name = data.rows.item(i).name;
          let target = data.rows.item(i).target;
          let amount = data.rows.item(i).amount;
          let uID = data.rows.item(i).uID;
          let deadline = data.rows.item(i).deadline;
          let memo = data.rows.item(i).memo;
          let resultObj = { gID, name, target, amount, uID, deadline, memo };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async selectTablebyID(tID: number) {
    console.log("Select transaction id : ", tID);
    await this.selectTransactionTableById(tID);
    console.log('selectTransactionTableById(sql) result is ', this.resultByID)
    return this.resultByID
  }

  async selectUserTablebyID(username: string) {
    console.log("Username  : ", username);
    await this.selectUserTableByUsername(username);
    console.log('selectUserTablebyID(sql) result is ', this.userPw)
    return this.userPw
  }

  async selectUserTableByUsername(username: string) {
    return this.db.executeSql(`
    SELECT * FROM Users WHERE uID="`+ username + `" 
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.userPw = data.rows.item(i).PW;
        }
      })
      .catch(e => console.log(e));
  }

  async selectDistinctdate() {
    await this.selectDate();
    console.log('the distinct date are ', this.date);
    return this.date
  }

  async selectTransactionTable() {
    return this.db.executeSql(`
    SELECT * FROM Transactions 
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let tID = data.rows.item(i).tID;
          let date = data.rows.item(i).date;
          let type = data.rows.item(i).type;
          let tag = data.rows.item(i).tag;
          let amount = data.rows.item(i).amount;
          let memo = data.rows.item(i).memo;
          let walletName = data.rows.item(i).walletName;
          let resultObj = { tID, date, type, tag, amount, memo, walletName };
          this.result.push(resultObj);
        }
        console.log("SelectTransactiontable is doing (sql) #6");
      })
      .catch(e => console.log(e));
  }

  async selectTransactionTableById(tID: number) {
    console.log("tID in selectTransactionTableById is ", tID)
    return this.db.executeSql(`
    SELECT * FROM Transactions WHERE tID = `+ tID + `
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.resultByID = [];
        for (let i = 0; i < data.rows.length; i++) {
          let tID = data.rows.item(i).tID;
          let date = data.rows.item(i).date;
          let type = data.rows.item(i).type;
          let tag = data.rows.item(i).tag;
          let amount = data.rows.item(i).amount;
          let memo = data.rows.item(i).memo;
          let walletName = data.rows.item(i).walletName;
          let resultObj = { tID, date, type, tag, amount, memo, walletName };
          this.resultByID.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async selectDate() {
    return this.db.executeSql(`
    SELECT DISTINCT date FROM Transactions 
    ORDER BY date DESC;
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.date = [];
        for (let i = 0; i < data.rows.length; i++) {
          let date = data.rows.item(i).date;
          this.date.push(date);
        }
        console.log("Select distinct date");
      })
      .catch(e => console.log(e));
  }

  async createTables() {
    await this.createUserTables();
    await this.createWalletTables();
    await this.createTransactionsTables();
    await this.createGoalTables();
    await this.createSessionTables();
    console.log("###Created Tables###")
  }

  createUserTables() {
    return this.db.executeSql(`
    create table Users(
    uID VARCHAR(32) PRIMARY KEY, 
    PW VARCHAR(32),
    name VARCHAR(32),
    picUrl VARCHAR
    ); 
    `, [])
      .then(() => console.log('Created Users Table'))
      .catch(e => console.log(e));
  }
  createWalletTables() {
    return this.db.executeSql(`
    create table Wallet(
    wID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(32),
    uID INTEGER,
    balance INTEGER,
    FOREIGN KEY (uID) REFERENCES Users(uID)
    );
  `, [])
      .then(() => console.log('Created Wallet Table'))
      .catch(e => console.log(e));
  }
  createGoalTables() {
    return this.db.executeSql(`
    create table Goal(
    gID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(32),      
    target INTEGER(32),
    amount INTEGER(32),
    memo VARCHAR(100),
    uID INTEGER,
    deadline DATE,
    FOREIGN KEY (uID) REFERENCES Users(uID)
    );
  `, [])
      .then(() => console.log('Created Goal Table'))
      .catch(e => console.log(e));
  }

  createTransactionsTables() {
    return this.db.executeSql(`
    create table Transactions(
    tID INTEGER PRIMARY KEY AUTOINCREMENT,
    walletName VARCHAR(32),
    type VARCHAR(32),
    memo VARCHAR(100),
    amount INTEGER,
    tag VARCHAR(32),
    gID INTEGER,
    date DATE,
    FOREIGN KEY (walletName) REFERENCES Wallet(name)
    );
  `, [])
      .then(() => console.log('Created Transactions Table'))
      .catch(e => console.log(e));
  }
  createSessionTables() {
    return this.db.executeSql(`
    create table Session(
      sID VARCHAR(32) PRIMARY KEY
    );
  `, [])
      .then(() => console.log('Created Session Table'))
      .catch(e => console.log(e));
  }

  async getUIDfromSession() {
    console.log("getUIDfromSession")
    return this.db.executeSql(`
    SELECT * FROM Session ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.uID = data.rows.item(i).sID;
          console.log("data.row.item(i).ID = ", data.rows.item(i).sID)
        }
        console.log("User's uid is ", this.uID);
        console.log("data.rows.length = ", data.rows.length);
      })
      .catch(e => console.log(e));
  }

  async getCurrentUID() {
    await this.getUIDfromSession();
    return this.uID
  }

  async getNameFromUser() {
    await this.getUIDfromSession();
    console.log("getNickName")
    return this.db.executeSql(`
    SELECT * FROM Users WHERE uID = "`+ this.uID + `" ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.userNickName = data.rows.item(i).name;
        }
        console.log("User's nick name is ", this.userNickName);
      })
      .catch(e => console.log(e));
  }

  async getNickName() {
    await this.getNameFromUser();
    return this.userNickName
  }

  async checkSession() {
    await this.selectSessionTable();
    console.log("checkSession, loginFalg is ", this.loginFlag);
    return this.loginFlag
  }

  async selectSessionTable() {
    console.log("selectSessionTable")
    return this.db.executeSql(`
    SELECT sID FROM Session ;
    `, [])
      .then((data) => {
        console.log("data.rows is ", data.rows.length);
        if (data.rows.length == 0) {
          this.loginFlag = false;
        } else {
          this.loginFlag = true;
        }
      })
      .catch(e => console.log(e));
  }

  insertTable(data: any, table: string) {
    console.log("insertTable (sql) #2")
    switch (table) {
      case "Transactions": {
        let { type, tag, amount, memo, date, walletName } = data;
        console.log("### this new transaction's walletName is ", walletName);
        this.db.executeSql(`
      INSERT INTO Transactions(date,type,tag,amount,memo,walletName)
      VALUES ("`+ date + `","` + type + `","` + tag + `",` + amount + `,"` + memo + `","` + walletName + `")
      `, [])
          .then(() => console.log('Inserted Transaction table'))
          .catch(e => console.log(e));
        break;
      }
      case "Users": {
        let { ID, PW, name, picUrl } = data;
        this.db.executeSql(`
      INSERT INTO Users(uID,PW,name,picUrl)
      VALUES ("`+ ID + `","` + PW + `","` + name + `","` + picUrl + `")
      `, [])
          .then(() => console.log('Inserted Users table'))
          .catch(e => console.log(e));
        break;
      }
      case "Wallet": {
        let { name, UID, balance } = data;
        this.db.executeSql(`
      INSERT INTO Wallet(name,uID,balance)
      VALUES ("` + name + `","` + UID + `",` + balance + `)
      `, [])
          .then(() => console.log('Inserted Wallet table'))
          .catch(e => console.log(e));
        break;
      }
      case "Goal": {
        let { name, target, memo, UID, deadline } = data;
        this.db.executeSql(`
      INSERT INTO Goal(name,target,memo,UID,deadline,amount)
      VALUES ("` + name + `",` + target + `,"` + memo + `","` + UID + `","` + deadline + `",0)
      `, [])
          .then(() => console.log('Inserted Goal table'))
          .catch(e => console.log(e));
        break;
      }
      case "Session": {
        let ID = data;
        this.db.executeSql(`
      INSERT INTO Session(sID)
      VALUES ("`+ ID + `")
      `, [])
          .then(() => console.log('Inserted Session table and ID : ', ID))
          .catch(e => console.log(e));
        break;
      }
    }
  }

  updateTableByID(transaction: any, tID: number) {
    console.log("updating table")
    let { date, type, tag, amount, memo } = transaction
    console.log("new data (sql) are ", type, tag, amount, memo);
    this.db.executeSql(`
    UPDATE Transactions
    SET date = "`+ date + `", type = "` + type + `", tag = "` + tag + `", amount = ` + amount + `, memo = "` + memo + `"
    WHERE tID = `+ tID + `;
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }

  updateWalletTableByID(wallet: any) {
    console.log("updating table")
    let { wID, name, balance } = wallet
    console.log("new data (sql) are ", wallet);
    this.db.executeSql(`
    UPDATE Wallet
    SET name = "`+ name + `", balance = ` + balance + `
    WHERE wID = `+ wID + `;
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }

  updateGoalTableByID(goal: any) {
    console.log("updating table")
    let { gID, name, target, memo, deadline } = goal
    console.log("new data (sql) are ", goal);
    this.db.executeSql(`
    UPDATE Goal
    SET name = "`+ name + `", target = ` + target + `, memo = "`+memo+`", deadline = "`+deadline+`"
    WHERE gID = `+ gID + `;
    `, [])
      .then(() => console.log('Goal updated!'))
      .catch(e => console.log(e));
  }

  async getBalanceByWalletName(walletName: string) {
    return this.db.executeSql(`
    SELECT * FROM Wallet WHERE name = "`+ walletName + `" ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.currentBalance = data.rows.item(i).balance;
        }
        console.log("Balance is ", this.currentBalance);
      })
      .catch(e => console.log(e));
  }

  async updateBalance(balance: any) {
    console.log("updating balance")
    let { type, amount, walletName } = balance
    console.log("balance is ", balance);
    await this.getBalanceByWalletName(walletName);
    if (type == 'Income') {
      this.currentBalance += parseInt(amount);
    } else if (type == 'Expense' || type == 'Saving') {
      this.currentBalance -= parseInt(amount);
    } 
    this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ this.currentBalance + `
    WHERE name = "`+ walletName + `";
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }

  async updateBalanceWhenDelTran(transaction: any) {
    console.log("## updateBalanceWhenDelTran ##")
    let { type, amount, walletName } = transaction;
    console.log("transaction obj is ", transaction);
    await this.getBalanceByWalletName(walletName);
    if (type == 'Income') {
      this.currentBalance -= parseInt(amount);
    } else if (type == 'Expense' || type == 'Saving') {
      this.currentBalance += parseInt(amount);
    }
    this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ this.currentBalance + `
    WHERE name = "`+ walletName + `";
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }

  async getGoalTargetAndAmountByID(gID: number) {
    return this.db.executeSql(`
    SELECT * FROM Goal WHERE gID = `+ gID + ` ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.gTarget = data.rows.item(i).target;
          this.gAmount = data.rows.item(i).amount;
        }
        console.log("Target and Amount is ", this.gTarget, this.gAmount);
      })
      .catch(e => console.log(e));
  }

  pushNotification(msg: string) {
    this.localNotifications.schedule({
      text: msg,
      trigger: {at: new Date(new Date().getTime() + 2000)},
      led: 'FF0000',
      sound: null
   });
  }

  async updateGoalTarget(gID: number, amount: any) {
    let remainAmount = 0;
    await this.getGoalTargetAndAmountByID(gID);
    this.gAmount =  parseInt(this.gAmount) + parseInt(amount);
    console.log("this.gAmount is ",this.gAmount)
    remainAmount = this.gTarget - this.gAmount;
    console.log("gTarget is ",this.gTarget," gAmount is ,",this.gAmount)
    if (remainAmount > 0) {
      this.pushNotification("Keep going! you still need to collect "+remainAmount+" more Baht.");
    } else if (remainAmount == 0){
      this.pushNotification("Congratulation! your goal is achieved.");
    }
    this.db.executeSql(`
    UPDATE Goal
    SET amount = `+ this.gAmount + `
    WHERE gID = `+ gID + `;
    `, [])
      .then(() => console.log('Goal updated!'))
      .catch(e => console.log(e));
  }

  async checkGoalNewTarget(gID: number, newTarget: any){
    let target = parseInt(newTarget);
    await this.getGoalTargetAndAmountByID(gID);
    if(target < this.gTarget && parseInt(this.gAmount) > target){
      let remainAmount = this.gAmount - target;
      return remainAmount
    } else {
      return false
    }
  }
}
