
import { Injectable } from '@angular/core';

@Injectable()
export class SqlProviderMock {
  constructor(
  ) {
  }

  checkFirstTime() {
    return true
  }

  openDB() {
    return 'Opened Database'
  }

  dropTable() {
    return 'Dropped Table'
  }

  selectTable() {
    let result = ['res'];
    return result
  }


  selectDistinctdate() {
    let date = ['21-07-2019','22-07-2019','23-07-2019']
    return date
  }

  createTable() {
    return 'Created Table'
  }

  createTable2() {
    return 'Inserted Table'
  }
}
