import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {
  public db: SQLiteObject;
  constructor( 
    private sqlite: SQLite,
  ) {
    console.log('Hello SqlProvider Provider');
  }

  createTable() {
    return 'create table success'
  }
  selctTable() {
    return ['result']
  }
  openDB(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      this.db = database;
    });
  }

  dropTable() {
    //   this.db.executeSql(`
    //   DROP TABLE User;
    //   `, [])
    //     .then(() => console.log('DROP FINISHED'))
    //     .catch(e => console.log(e));
    // }
    return 'drop table successfully.'
  }
}
