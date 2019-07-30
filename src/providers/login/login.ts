import { SqlProvider } from './../sql/sql';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(
    private sql: SqlProvider,
  ) {
    console.log('Hello LoginProvider Provider');
  }

 async checkLogin(username: string, password: string){
    if(await this.selectUsersTable(username, password)){
      console.log('correct username and password');
    } else {
      console.log('incorrect username and password');
    }
  }

  async selectUsersTable(username: string,  password: string){
    let tmpPw = await this.sql.selectUserTablebyID(username);
    console.log("tmpPw is "+tmpPw,"password is "+password);
    if(password != tmpPw){
      return false
    } else {
      return true
    }
  }
}
