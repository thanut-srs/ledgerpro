
import { Injectable } from '@angular/core';

@Injectable()
export class SqlProviderMock {
  constructor(
  ) {
  }


  allowToCreateTable() {
    return { modal : 'yes'}
  }

  deleteRowById(tID: number) {
    return 'delete success'
  }

  openDB() {
    return 'Opened Database'
  }

  dropTabls() {
    return 'Dropped Tables'
  }

  selectTable() {
    let resultObj = [{ tID: 1, date:'21-07-2019', type:'Income', tag:'Food', amount:30, memo:'Morning'} ,
    {tID: 2, date:'22-07-2019', type:'Income', tag:'Food', amount:30, memo:'Morning}' ,
    {tID: 3, date:'23-07-2019', type:'Income', tag:'Food', amount:30, memo:'Morning' }];
    return Promise.resolve(resultObj)
  }

  async selectTablebyID(tID: number) {
    let result = [{name: 'Tester',
                  date: '22-07-2019',
                }] 
    return result
  }

  selectDistinctdate() {
    let date = ['21-07-2019','22-07-2019','23-07-2019']
    return Promise.resolve(date)
  }
  insertTable(data: any, table: string) {
    return 'INSERT FINISHED'
  }

  getNickName(){
    return 'fake nickname'
  }

  async selectTransactionTable(){
    return 'SelectTransactiontable'
  }

  async selectTransactionTableById(){
    return 'selectTransactionTableById'
  }

  createTable() {
    return 'Created Table'
  }

  createTable2() {
    return 'Inserted Table'
  }
  async selectDate() {
    return 'Select date'
  }
  async createTables() {
    return '###Created Tables###'
  }
  createUserTables(){
    return 'User Tables created'
  }
  createWalletTables(){
    let result = [{name: 'A',balance: '20',uID: '2',wID:'2'}];
    return result
  }
  createGoalTables(){
    return 'User Goal created'
  }
  createTransactionsTables(){
    return 'User Transactions created'
  }
  createSessionTables(){
    return 'User Session created'
  }
  async checkSession() {
    return 'check login flag'
  }
  async selectSessionTable() {
    return 'select session table for login' 
  }

  updateTableByID(transaction: any, tID: number) {
    return 'table updated'
  }
}
