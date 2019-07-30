import { FirstLoginPage } from './../../pages/first-login/first-login';
import { ModalController } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {
  public db: SQLiteObject;
  public result = [];
  public resultByID = [];
  public date = [];
  public loginFlag = null;
  public userPw = "";
  constructor(
    public sqlite: SQLite,
    public modalCtrl: ModalController,
  ) {
    console.log('Hello SqlProvider Provider');
  }

  checkFirstTime() {
    this.db.executeSql(`
    SELECT * FROM Transactions 
    `, [])
      .then(() => {
        console.log("Table existed !!!");
      }
      )
      .catch(() =>
        this.allowToCreateTable()
      );
  }

  allowToCreateTable() {
    const modal = this.modalCtrl.create(FirstLoginPage);
    modal.onDidDismiss(() => {
      this.createTables()
    });
    modal.present();
  }

  openDB() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      this.db = database;
      // this.checkFirstTime();
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

  async selectTable() {
    console.log("Select Table (sql) #5");
    await this.selectTransactionTable();
    console.log('selectTable(sql) result is ', this.result)
    console.log("SelectTransactiontable is done (sql) #7");
    return this.result
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

  async selectUserTableByUsername(username: string){
    return this.db.executeSql(`
    SELECT * FROM Users WHERE ID="`+username+`" 
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
          let resultObj = { tID, date, type, tag, amount, memo };
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
          let resultObj = { tID, date, type, tag, amount, memo };
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

  // createTable() {
  //   console.log("Create dummy table")
  //   this.db.executeSql(`
  //   CREATE TABLE Transactions(
  //   tID INTEGER PRIMARY KEY AUTOINCREMENT,
  //   date DATE,
  //   type VARCHAR(32),
  //   tag VARCHAR(32),
  //   amount INTEGER,
  //   memo VARCHAR(100)
  //   );
  // `, [])
  //     .then(() => console.log('TABLE CREATED'))
  //     .catch(e => console.log(e));
  //   return 'Created Table'
  // }

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
    ID VARCHAR(32) PRIMARY KEY, 
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
    UID INTEGER,
    balance INTEGER,
    FOREIGN KEY (UID) REFERENCES Users(ID)
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
    UID INTEGER,
    deadline DATE,
    FOREIGN KEY (UID) REFERENCES Users(ID)
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
    FOREIGN KEY (wID) REFERENCES Wallet(WltID)
    );
  `, [])
      .then(() => console.log('Created Transactions Table'))
      .catch(e => console.log(e));
  }
  createSessionTables() {
    return this.db.executeSql(`
    create table Session(
      ID VARCHAR(32) PRIMARY KEY
    );
  `, [])
      .then(() => console.log('Created Session Table'))
      .catch(e => console.log(e));
  }

  // createTables() {
  //   this.db.executeSql(`
    // create table User(
    // ID VARCHAR(32) PRIMARY KEY, 
    // PW VARCHAR(32),
    // name VARCHAR(32),
    // picUrl VARCHAR
    // );
    // create table Wallet(
    //   wID INTEGER PRIMARY KEY AUTOINCREMENT,
    //   name VARCHAR(32),
    //   UID VARCHAR(32),
    //   balance INTEGER(32),
    //   FOREIGN KEY (UID) REFERENCES User(ID)
    // );
    // create table Goal(
    //   gID INTEGER PRIMARY KEY AUTOINCREMENT,
    //   name VARCHAR(32),
    //   target INTEGER(32),
    //   amount INTEGER(32),
    //   UID VARCHAR(32),
    //   deadline DATE,
    //   FOREIGN KEY (UID) REFERENCES User(ID)
    // );
    // create table Transactions(
    //   tID INTEGER PRIMARY KEY AUTOINCREMENT,
    //   wID VARCHAR(32),
    //   type VARCHAR(32),
    //   memo VARCHAR(100),
    //   amount INTEGER,
    //   tag VARCHAR(32),
    //   gID VARCHAR(3),
    //   date DATE,
    //   FOREIGN KEY (wID) REFERENCES Wallet(WltID)
    // );
    // create table Session(
    //   ID VARCHAR(32) PRIMARY KEY
    // );
  // `, [])
  //     .then(() => console.log('Executed SQL'))
  //     .catch(e => console.log(e));
  //   return 'Created Table'
  // }

  async checkSession() {
    await this.selectSessionTable();
    console.log("checkSession, loginFalg is ", this.loginFlag);
    return this.loginFlag
  }

  async selectSessionTable() {
    console.log("selectSessionTable")
    return this.db.executeSql(`
    SELECT ID FROM Session ;
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

  insertTable(data: any,table: string) {
    console.log("insertTable (sql) #2")
    switch(table){
     case "Transactions":{
      let { type,tag,amount,memo,date} = data;
      this.db.executeSql(`
      INSERT INTO Transactions(date,type,tag,amount,memo)
      VALUES ("`+ date + `","` + type + `","` + tag + `",` + amount + `,"` + memo + `")
      `, [])
        .then(() => console.log('Inserted Transaction table'))
        .catch(e => console.log(e));
        break;
     }
     case "Users":{
      let { ID,PW,name,picUrl} = data;
      this.db.executeSql(`
      INSERT INTO Users(ID,PW,name,picUrl)
      VALUES ("`+ ID + `","` + PW + `","` + name + `","` + picUrl + `")
      `, [])
        .then(() => console.log('Inserted Users table'))
        .catch(e => console.log(e));
        break;
     }
     case "Wallet":{
      let { wID, name, UID, balance} = data;
      this.db.executeSql(`
      INSERT INTO Wallet(wID,name,UID,balance)
      VALUES (`+ wID + `,"` + name + `",` + UID + `,` + balance + `)
      `, [])
        .then(() => console.log('Inserted Wallet table'))
        .catch(e => console.log(e));
        break;
     }
     case "Goal":{
      let { gID, name, target, amount, UID,deadline} = data;
      this.db.executeSql(`
      INSERT INTO Goal(gID,name,target,amount,UID,deadline)
      VALUES (`+ gID + `,"` + name + `",` + target + `,` + amount + `,`+ UID +`,"`+ deadline +`")
      `, [])
        .then(() => console.log('Inserted Goal table'))
        .catch(e => console.log(e));
        break;
     }
     case "Session":{
      let { ID } = data;
      this.db.executeSql(`
      INSERT INTO Session(ID)
      VALUES (`+ ID +`)
      `, [])
        .then(() => console.log('Inserted Session table'))
        .catch(e => console.log(e));
        break;
     }
    }
  }

  updateTableByID(transaction: any, tID: number) {
    console.log("updating table")
    let { date,type,tag,amount,memo} = transaction
    console.log("new data (sql) are ", type, tag, amount, memo);
    this.db.executeSql(`
    UPDATE Transactions
    SET date = "`+ date + `", type = "` + type + `", tag = "` + tag + `", amount = ` + amount + `, memo = "` + memo + `"
    WHERE tID = `+ tID + `;
    `, [])
      .then(() => console.log('Transaction updated!'))
      .catch(e => console.log(e));
  }
}
