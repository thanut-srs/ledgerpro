import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {

  constructor(
    public http: HttpClient,

  ) {
    console.log('Hello SqlProvider Provider');
  }

  createTable() {

  }
  selctTable() {
    return ['result']
  }

  dropTable() {
    //   this.db.executeSql(`
    //   DROP TABLE User;
    //   `, [])
    //     .then(() => console.log('DROP FINISHED'))
    //     .catch(e => console.log(e));
    // }
  }
}
