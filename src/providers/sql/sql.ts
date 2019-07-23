import { HttpClient } from '@angular/common/http';
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
  public list = [];
  constructor(
    public http: HttpClient,
    public sqlite: SQLite,
    ) {
    console.log('Hello SqlProvider Provider');
  }

openDB(){
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  }).then((database: SQLiteObject) => {
    this.db = database;
  });
  return 'Opened Database'
}

dropTable(){
  this.db.executeSql(`
  DROP TABLE User;
  `, [])
    .then(() => console.log('DROP FINISHED'))
    .catch(e => console.log(e));
    return 'Dropped Table'
}

selectTable(){
  let result =[];
  this.db.executeSql(`
    SELECT * FROM User 
    `, [])
      .then((data) => {
        console.log(data)
        console.log(data.rows.length);
        for (let i = 0; i < data.rows.length; i++) {
          let name = data.rows.item(i).name;
          let age = data.rows.item(i).age;
          let resultObj ={name,age};
          result.push(resultObj);
        }
      })
      .catch(e => console.log(e));
      console.log("Add data to array");
      return result
}

createTable(){
  this.db.executeSql(`
  CREATE TABLE User(
    name VARCHAR(32),
    age VARCHAR(32)
    );
  `, [])
    .then(() => console.log('TABLE CREATED'))
    .catch(e => console.log(e));
    return 'Created Table'
}
  createTable2() {
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

  insertTable(name: string, age: string){
    this.db.executeSql(`
    INSERT INTO User(name,age)
    VALUES ("`+name+`","`+age+`")
    `, [])
      .then(() => console.log('INSERT FINISHED'))
      .catch(e => console.log(e));

      return 'Inserted Table'
  }
}
