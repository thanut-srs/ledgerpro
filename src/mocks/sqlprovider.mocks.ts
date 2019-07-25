
import { Injectable } from '@angular/core';

@Injectable()
export class SqlProviderMock {
  constructor(
    ) {
  }

checkFirstTime(){
  return true
}

openDB(){
  return 'Opened Database'
}

dropTable(){
    return 'Dropped Table'
}

selectTable(){
  let result =['res'];
  return result
}

createTable(){
    return 'Created Table'
}
  
createTable2() {
    return 'Inserted Table'
}
}
