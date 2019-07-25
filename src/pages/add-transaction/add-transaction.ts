import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, NgModel } from '@angular/forms';

/**
 * Generated class for the AddTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage {
  public transaction: FormGroup;
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider
    ) {
      
      this.transaction = this.formBuilder.group({
        amount: ['', Validators.required],
        tag: ['', Validators.required],
        type: ['', Validators.required],
        memo: [''],
      });
  }
  ngOnInit() {
  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransactionPage');
  }
  onInsertTable(){
    console.log("onInsertTable #1")
    let transactionObj = {type: this.transaction.controls['type'].value,
       tag: this.transaction.controls['tag'].value,
       amount: this.transaction.controls['amount'].value,
       memo: this.transaction.controls['memo'].value
      };
      this.sql.insertTable(transactionObj);
      this.viewCtrl.dismiss();
  }
  onDeleteTable(){
    this.sql.dropTable();
  }
  onAddTable(){
    this.sql.createTable();
  }
}