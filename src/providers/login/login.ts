import { SqlProvider } from './../sql/sql';
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
      await this.createSession(username);
      return true
    } else {
      console.log('incorrect username and password');
      return false
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

  async createSession(username: string){
     this.sql.insertTable(username, 'Session')
  }

  logout(){
    this.sql.deleteSession();
  }

}
