import { LocalNotifications } from '@ionic-native/local-notifications';
import { ModalController, Nav } from 'ionic-angular';
import { Injectable, ViewChild } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import * as moment from 'moment';

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
  public eachDate = [];
  public loginFlag = null;
  public userPw = "";
  public userNickName = "";
  public uID = "";
  public currentBalance: number;
  public gTarget: any;
  public gAmount: any;
  public picUrl: string;
  public gStatus: string;
  public walletName: string;
  public gName: string;
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

  async checkFirstTime() {
    await this.checkTable()
    console.log("the result is ", this.result);
    if (this.result.length == 0) {
      console.log("YOU'VE COME INTO MORDOR FOR FIRST TIME!!!!!!!!!!!!!!!!!!");
      return true
    } else {
      return false
    }
  }

  checkTable() {
    return this.db.executeSql(`
    SELECT name FROM sqlite_master 
    WHERE type ='table' AND name NOT LIKE 'sqlite_%';
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i);
          this.result.push(name);
        }
        console.log(this.result)
      })
      .catch(e => console.log(e));
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

  async deleteTransactionBywID(wID: number) {
    console.log('Welcome to delete transaction by wallet name!!!!');
    console.log('Wallet name is ', wID);
    this.db.executeSql(`
  DELETE FROM Transactions WHERE wID = "`+ wID + `";
  `, [])
      .then(() => console.log('Delete transaction (wID: ' + wID + ')'))
      .catch(e => console.log(e));
  }

  async deleteWallet(wID: number, wName: string) {
    await this.deleteWalletById(wID);
    await this.deleteTransactionBywID(wID);
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

  async getWalletListByUid(uID: string) {
    await this.selectWalletListByUid(uID);
    console.log("getWalletListByUid's result is ", this.result);
    return this.result
  }
  async selectWalletListByUid(uID: string) {
    console.log("uID(sql) is ", uID)
    return this.db.executeSql(`
    SELECT * FROM Wallet WHERE uID = "`+ uID + `"
    `, [])
      .then((data) => {
        console.log(data)
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i).name;
          let wID = data.rows.item(i).wID;
          let balance = data.rows.item(i).balance;
          let resultObj = { name, wID, balance };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log("FAIL!!!!!!", e));
  }

  async getGoal() {
    await this.selectGoalTable();
    return this.result
  }

  async selectGoalTable() {
    let now = moment().format('LLLL');
    console.log("### moment test ", now, " ###")
    return this.db.executeSql(`
    SELECT * FROM Goal 
    `, [])
      .then(async (data) => {
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
          let gStatus = data.rows.item(i).gStatus;
          let dayLeft = Math.ceil((moment.duration(moment().diff(deadline))).asHours());
          if (moment() > deadline) {
            dayLeft = (-1) * dayLeft;
          }
          if (dayLeft > 0 && gStatus != 'Achieved') {
            await this.pushNotification("Your goal is delayed.");
            await this.changeGoalStatus("Delayed", gID);
            gStatus = 'Delayed'
          }
          let resultObj = { gID, name, target, amount, uID, deadline, memo, gStatus, dayLeft };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
  }

  async getGoalById(gID: number) {
    await this.selectGoalTableById(gID);
    console.log("result from getGoalById is ", this.result)
    return this.result
  }

  async selectGoalTableById(gID: number) {
    console.log("gID in selectGoalTableById is ", gID);
    return this.db.executeSql(`
    SELECT * FROM Goal WHERE gID = `+ gID + `
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
      .then(async (data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          await this.getWalletNameByID(data.rows.item(i).wID);
          await this.getGoalName(data.rows.item(i).gID);
          let tID = data.rows.item(i).tID;
          let date = data.rows.item(i).date;
          let type = data.rows.item(i).type;
          let tag = data.rows.item(i).tag;
          let amount = data.rows.item(i).amount;
          let memo = data.rows.item(i).memo;
          let wID = data.rows.item(i).wID;
          let goalName = this.gName;
          let wName = this.walletName;
          let resultObj = { tID, date, type, tag, amount, memo, wID, wName, goalName };
          this.result.push(resultObj);
        }
        console.log("SelectTransactiontable is doing (sql) #6");
      })
      .catch(e => console.log(e));
  }

  getGoalName(gID: number) {
    console.log("gID in getGoalName is ", gID)
    return this.db.executeSql(`
    SELECT * FROM Goal WHERE gID = `+ gID + ` ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.gName = data.rows.item(i).name;
          console.log("!!!### this.gName is ", this.gName, " ###!!!")
        }
      })
      .catch(e => console.log(e));
  }

  async getWalletNameByID(walletID: number) {
    console.log("walletID is ", walletID);
    return this.db.executeSql(`
    SELECT * FROM Wallet WHERE wID = `+ walletID + ` ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.walletName = data.rows.item(i).name;
        }
        console.log("walletName is ", this.walletName);
      })
      .catch(e => console.log(e));
  }

  async getWalletName(wID: number) {
    await this.getWalletNameByID(wID);
    return this.walletName
  }

  async selectTransactionTableById(tID: number) {
    console.log("tID in selectTransactionTableById is ", tID)
    return this.db.executeSql(`
    SELECT * FROM Transactions WHERE tID = `+ tID + `
    `, [])
      .then(async (data) => {
        console.log(data)
        console.log(data.rows.length);
        this.resultByID = [];
        for (let i = 0; i < data.rows.length; i++) {
          await this.getWalletNameByID(data.rows.item(i).wID);
          await this.getGoalName(data.rows.item(i).gID);
          let tID = data.rows.item(i).tID;
          let date = data.rows.item(i).date;
          let type = data.rows.item(i).type;
          let tag = data.rows.item(i).tag;
          let amount = data.rows.item(i).amount;
          let memo = data.rows.item(i).memo;
          let wID = data.rows.item(i).wID;
          let goalName = this.gName;
          let gID = data.rows.item(i).gID;
          let wName = this.walletName;
          let resultObj = { tID, date, type, tag, amount, memo, wID, wName, goalName, gID };
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

  async selectDistinctdateByWid(wID: any) {
    await this.selectDateByWid(wID);
    console.log('the distinct date are ', this.date);
    return this.eachDate
  }

  async selectDateByWid(wID: any) {
    console.log("#### selectDateByWid's wID is ", wID);
    return this.db.executeSql(`
    SELECT DISTINCT date FROM Transactions WHERE wID = `+ parseInt(wID) + `
    ORDER BY date DESC;
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.eachDate = [];
        for (let i = 0; i < data.rows.length; i++) {
          let date = data.rows.item(i).date;
          this.eachDate.push(date);
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
    uID VARCHAR(32),
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
    memo VARCHAR(32),
    uID INTEGER,
    deadline DATE,
    gStatus VARCHAR(10),
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
    wID INTEGER,
    type VARCHAR(32),
    memo VARCHAR(100),
    amount INTEGER,
    tag VARCHAR(32),
    gID INTEGER,
    date DATE,
    FOREIGN KEY (wID) REFERENCES Wallet(wID)
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

  async getUserPicUrl() {
    await this.selectUserPicUrl();
    console.log("picUrl is ", this.picUrl)
    return this.picUrl
  }

  async selectUserPicUrl() {
    await this.getUIDfromSession();
    return this.db.executeSql(`
    SELECT * FROM Users WHERE uID = "`+ this.uID + `" ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.picUrl = data.rows.item(i).picUrl;
        }
        console.log("User's picUrl is ", this.picUrl);
      })
      .catch(e => console.log(e));
  }

  async selectNameFromUser() {
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
    await this.selectNameFromUser();
    return this.userNickName
  }

  async getUserTable() {
    await this.selectUserTable();
    console.log("getUserTable's result is ", this.result)
    return this.result
  }

  async selectUserTable() {
    console.log("## SelectUserTable ##")
    return this.db.executeSql(`
    SELECT * FROM Users 
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        this.result = [];
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i).name;
          let picUrl = data.rows.item(i).picUrl;
          let resultObj = { name, picUrl };
          this.result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
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
        let { type, tag, amount, memo, date, wID, goalID } = data;
        console.log("### this new transaction's walletName is ", data);
        this.db.executeSql(`
      INSERT INTO Transactions(date,type,tag,amount,memo,wID,gID)
      VALUES ("`+ date + `","` + type + `","` + tag + `",` + amount + `,"` + memo + `",` + wID + `,` + goalID + `)
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
        let { name, uID, balance } = data;
        this.db.executeSql(`
      INSERT INTO Wallet(name,uID,balance)
      VALUES ("` + name + `","` + uID + `",` + balance + `)
      `, [])
          .then(() => console.log('Inserted Wallet table'))
          .catch(e => console.log(e));
        break;
      }
      case "Goal": {
        let { name, target, memo, UID, deadline, gStatus } = data;
        this.db.executeSql(`
      INSERT INTO Goal(name,target,memo,UID,deadline,amount,gStatus)
      VALUES ("` + name + `",` + target + `,"` + memo + `","` + UID + `","` + deadline + `",0,"` + gStatus + `")
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

  async updateWalletWhenEdit(transaction: any, oldTran: any) {
    let { date, type, tag, amount, memo, wID, gID } = transaction
    await this.getBalanceByWalletID(wID);
    console.log("oldTran.amount is ", oldTran[0].amount)
    console.log("amount is ", amount)
    let remain = parseInt(oldTran[0].amount) - parseInt(amount);
    console.log("###### UPDATE WALLET WHEN EDIT #######");
    console.log('remain is ', remain);
    console.log(' 1# current balance is ', this.currentBalance);
    if (type == 'Income') {
      if (remain < 0) {
        this.currentBalance = this.currentBalance + (remain) * (-1);
      } else if (remain > 0) {
        this.currentBalance = this.currentBalance - (remain);
      }
    } else if (type == 'Expense' || type == 'Saving') {
      if (remain < 0) {
        this.currentBalance = this.currentBalance + (remain);
      } else if (remain > 0) {
        this.currentBalance = this.currentBalance - (remain) * (-1);
      }
    }
    if (type == 'Saving') {
      this.updateTargetWhenEdit(remain, gID);
    }
    console.log('2# current balance is ', this.currentBalance);
    return this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ this.currentBalance + `
    WHERE wID = `+ wID + `;
    `, [])
      .then(() => console.log('Wallet balance updated!'))
      .catch(e => console.log(e));
  }

  async updateTargetWhenEdit(remain: number, gID: number) {
    await this.getGoalTargetAndAmountByID(gID);
    await this.getGoalStatusByID(gID);
    if(this.gStatus != 'Achieved'){
    if (remain < 0) {
      this.gAmount = parseInt(this.gAmount) + (remain) * (-1);
    } else if (remain > 0) {
      this.gAmount = parseInt(this.gAmount) - remain;
    }
    this.db.executeSql(`
    UPDATE Goal
    SET amount = "` + this.gAmount + `"
    WHERE gID = `+ gID + `;
    `, [])
      .then(async () => {
        let remainAmount = 0;
        remainAmount = this.gTarget - this.gAmount;
        if (remainAmount > 0) {
          this.pushNotification("Keep going! you still need to collect " + remainAmount + " more Baht.");
        } else if (remainAmount == 0) {
          this.pushNotification("Congratulation! your goal is achieved.");
          this.changeGoalStatus("Achieved", gID);
        }
      })
      .catch(e => console.log(e));
  }
}


  async updateTableByID(transaction: any, oldTran: any) {
    console.log("updating table")
    let { date, type, tag, amount, memo, wID, gID } = transaction
    console.log("new data (sql) are ", oldTran[0].amount);
    await this.updateWalletWhenEdit(transaction, oldTran);
    this.db.executeSql(`
    UPDATE Transactions
    SET date = "`+ date + `", type = "` + type + `",
     tag = "` + tag + `", amount = ` + amount + `, 
     memo = "` + memo + `", wID = ` + wID + `, gID =` + gID + `
    WHERE tID = `+ oldTran[0].tID + `;
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

  async updateWalletBalanceByID(wID: number, remain: any) {
    console.log("updating balance")
    console.log("### updateWalletBalanceByID's wID is ",wID)
    await this.getBalanceByWalletID(wID);
    let balance = this.currentBalance + parseInt(remain);
    console.log(this.currentBalance, " + ", remain, " = ", balance)
    this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ balance + `
    WHERE wID = `+ wID + `;
    `, [])
      .then(() => console.log('Wallet balance updated!'))
      .catch(e => console.log(e));
  }

  updateUserPicByID(path: string, uID: string) {
    console.log("updating table")
    this.db.executeSql(`
    UPDATE Users
    SET picUrl = "` + path + `"
    WHERE uID = "`+ uID + `";
    `, [])
      .then(() => console.log('Profile pic updated!'))
      .catch(e => console.log(e));
  }
  updateUserNameByID(name: string, uID: string) {
    console.log("updating table")
    this.db.executeSql(`
    UPDATE Users
    SET name = "` + name + `"
    WHERE uID = "`+ uID + `";
    `, [])
      .then(() => console.log('Profile name updated!'))
      .catch(e => console.log(e));
  }
  async updateGoalTableByID(goal: any) {
    console.log("updating table")
    let { gID, name, target, memo, deadline } = goal
    console.log("new data (sql) are ", goal);
    this.db.executeSql(`
    UPDATE Goal
    SET name = "`+ name + `", target = ` + target + `, memo = "` + memo + `", deadline = "` + deadline + `"
    WHERE gID = `+ gID + `;
    `, [])
      .then(() => console.log('Goal updated!'))
      .catch(e => console.log(e));
  }

  async getBalanceByWalletID(walletID: number) {
    return this.db.executeSql(`
    SELECT * FROM Wallet WHERE wID = `+ walletID + ` ;
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
    let { type, amount, walletID } = balance
    console.log("balance is ", balance);
    await this.getBalanceByWalletID(walletID);
    if (type == 'Income') {
      this.currentBalance += parseInt(amount);
    } else if (type == 'Expense' || type == 'Saving') {
      this.currentBalance -= parseInt(amount);
    }
    this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ this.currentBalance + `
    WHERE wID = "`+ walletID + `";
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }

  async updateBalanceWhenDelTran(transaction: any) {
    console.log("## updateBalanceWhenDelTran ##")
    let { type, amount, wID } = transaction;
    console.log("transaction obj is ", transaction);
    await this.getBalanceByWalletID(wID);
    if (type == 'Income') {
      this.currentBalance -= parseInt(amount);
    } else if (type == 'Expense' || type == 'Saving') {
      this.currentBalance += parseInt(amount);
    }

    this.db.executeSql(`
    UPDATE Wallet
    SET balance = `+ this.currentBalance + `
    WHERE wID = `+ wID + `;
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

  async getAmountByID(gID: number) {
    await this.getGoalTargetAndAmountByID(gID)
    return this.gAmount
  }

  async pushNotification(msg: string) {
    this.localNotifications.schedule({
      text: msg,
      trigger: { at: new Date(new Date().getTime() + 2000) },
      led: 'FF0000',
      sound: null
    });
  }

  async updateGoalTarget(gID: number, amount: any) {
    let remainAmount = 0;
    await this.getGoalTargetAndAmountByID(gID);
    this.gAmount = parseInt(this.gAmount) + parseInt(amount);
    console.log("this.gAmount is ", this.gAmount)
    remainAmount = this.gTarget - this.gAmount;
    console.log("gTarget is ", this.gTarget, " gAmount is ,", this.gAmount)
    if (remainAmount > 0) {
      this.pushNotification("Keep going! you still need to collect " + remainAmount + " more Baht.");
      this.changeGoalStatus("Inprogress", gID);
    } else if (remainAmount == 0) {
      this.pushNotification("Congratulation! your goal is achieved.");
      this.changeGoalStatus("Achieved", gID);
    }
    this.db.executeSql(`
    UPDATE Goal
    SET amount = `+ this.gAmount + `
    WHERE gID = `+ gID + `;
    `, [])
      .then(() => console.log('Goal updated!'))
      .catch(e => console.log(e));
  }

  async checkGoalNewTarget(gID: number, newTarget: any) {
    await this.getGoalTargetAndAmountByID(gID);
    let nTarget = parseInt(newTarget);
    let amount = parseInt(this.gAmount);
    let remainAmount = amount - nTarget;
    console.log("remainAmount is ", remainAmount)
    if (nTarget <= this.gTarget) {
      if (this.gAmount > nTarget) {
        this.changeGoalStatus("Achieved", gID)
        this.pushNotification("Congratulation! your goal is achieved.");
        return remainAmount
      } else {
        remainAmount = (-1)*(remainAmount);
        this.changeGoalStatus("Inprogress", gID);
        this.pushNotification("Keep going! you still need to collect " + remainAmount + " more Baht.");
        return false
      }
    }
    return false
  }


  async changeGoalStatus(gStatus: string, gID: number) {
    console.log("## gStatus in changeGoalStatus is ", gStatus)
    this.db.executeSql(`
    UPDATE Goal
    SET gStatus = "`+ gStatus + `"
    WHERE gID = `+ gID + `;
    `, [])
      .then(() => console.log("Goal's status updated!"))
      .catch(e => console.log(e));
  }

  async getGoalStatusByID(gID: number) {
    await this.selectGoalStatusByID(gID)
    return this.gStatus
  }

  selectGoalStatusByID(gID: number) {
    return this.db.executeSql(`
    SELECT * FROM Goal WHERE gID = `+ gID + ` ;
    `, [])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          this.gStatus = data.rows.item(i).gStatus;
        }
        console.log("gStatus of  ", gID, " is ", this.gStatus);
      })
      .catch(e => console.log(e));
  }

  async deleteGoalByID(gID: number) {
    this.db.executeSql(`
  DELETE FROM Goal WHERE gID = `+ gID + `;
  `, [])
      .then(() => {
        console.log('Delete goal (wID: ' + gID + ')')
      })
      .catch(e => console.log(e));
  }

  async getGoalRemainByID(gID: number) {
    await this.getGoalTargetAndAmountByID(gID)
    return parseInt(this.gTarget) - parseInt(this.gAmount);
  }
}
