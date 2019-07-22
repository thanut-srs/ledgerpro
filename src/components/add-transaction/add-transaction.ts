import { Component } from '@angular/core';

/**
 * Generated class for the AddTransactionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-transaction',
  templateUrl: 'add-transaction.html'
})
export class AddTransactionComponent {

  text: string;

  constructor() {
    console.log('Hello AddTransactionComponent Component');
    this.text = 'Hello World';
  }

}
