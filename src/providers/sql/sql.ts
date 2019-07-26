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
  public date =[];
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

  allowToCreateTable(){
    const modal = this.modalCtrl.create(FirstLoginPage);
    modal.onDidDismiss(() => {
      this.createTable()
    });
    modal.present();
  
  }

  openDB() {
   return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      this.db = database;
      this.checkFirstTime();
    });
  }

  dropTable() {
    this.db.executeSql(`
  DROP TABLE Transactions;
  `, [])
      .then(() => console.log('DROP FINISHED'))
      .catch(e => console.log(e));
    return 'Dropped Table'
  }

  async selectTable() {
    console.log("Select Table (sql) #5");
    await this.selectTransactionTable();
    console.log('selectTable(sql) result is ', this.result)
    console.log("SelectTransactiontable is done (sql) #7");
    return this.result
  }

  async selectDistinctdate() {
    await this.selectDate();
    console.log('the distinct date are ',this.date);
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
          let date = data.rows.item(i).date;
          let type = data.rows.item(i).type;
          let tag = data.rows.item(i).tag;
          let amount = data.rows.item(i).amount;
          let memo = data.rows.item(i).memo;
          let resultObj = { date, type, tag, amount, memo };
          this.result.push(resultObj);
        }
        console.log("SelectTransactiontable is doing (sql) #6");
      })
      .catch(e => console.log(e));
  }

  async selectDate(){
    return this.db.executeSql(`
    SELECT DISTINCT date FROM Transactions 
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

  createTable() {
    console.log("H!!!!")
    this.db.executeSql(`
  CREATE TABLE Transactions(
    date DATE,
    type VARCHAR(32),
    tag VARCHAR(32),
    amount INTEGER,
    memo VARCHAR(100)
    );
  `, [])
      .then(() => console.log('TABLE CREATED'))
      .catch(e => console.log(e));
    return 'Created Table'
  }
  createTables() {
    this.db.executeSql(`
    create table User(
    ID VARCHAR(32), 
    PW VARCHAR(32),
    name VARCHAR(32),
    picUrl VARCHAR,
    PRIMARY KEY (ID)
    );
    create table Wallet(
      WltID VARCHAR(32),
      name VARCHAR(32),
      UID VARCHAR(32),
      balance INTEGER(32),
      PRIMARY KEY (WltID),
      FOREIGN KEY (UID) REFERENCES User(ID)
    );
    create table Goal(
      ID VARCHAR(3),
      name VARCHAR(32),
      target INTEGER(32),
      amount INTEGER(32),
      UID VARCHAR(32),
      deadline DATE,
      PRIMARY KEY (ID),
      FOREIGN KEY (UID) REFERENCES User(ID)
    );
    create table Transactions(
      tstID VARCHAR(4),
      wID VARCHAR(32),
      type VARCHAR(32),
      memo VARCHAR(250),
      tag VARCHAR(32),
      gID VARCHAR(3),
      date DATE,
      PRIMARY KEY (tstID),
      FOREIGN KEY (wID) REFERENCES Wallet(WltID)
    );
  `, [])
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    return 'Created Table'
  }

  insertTable(transaction: any) {
    console.log("insertTable (sql)  #2")
    let type = transaction.type;
    let tag = transaction.tag;
    let amount = transaction.amount;
    let memo = transaction.memo;
    let date = transaction.date;
    console.log(type, tag, amount, memo);
    this.db.executeSql(`
    INSERT INTO Transactions(date,type,tag,amount,memo)
    VALUES ("`+ date + `","`+ type + `","` + tag + `","` + amount + `","` + memo + `")
    `, [])
      .then(() => console.log('INSERT FINISHED'))
      .catch(e => console.log(e));
    return 'Inserted Table'
  }
}
