import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  public currentDate = null;
  public year = null;
  public collection = [];
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
  ) {
    this.transaction = this.formBuilder.group({
      date: [this.currentDate, Validators.required],
      amount: ['', Validators.required],
      tag: ['', Validators.required],
      walletName: ['', Validators.required],
      type: ['', Validators.required],
      memo: [''],
    });
  }
  async ngOnInit() {
    this.setDate();
    await this.getWalletList();
  }

  setDate() {
    let date = new Date();
    let year = date.getFullYear();
    this.year = year;
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = ("0" + date.getDate()).slice(-2)
    let currentDay = year + "-" + month + "-" + day;
    this.currentDate = currentDay;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransactionPage');
  }
  onInsertTable() {
    console.log("onInsertTable #1")
    let transactionObj = {
      type: this.transaction.controls['type'].value,
      tag: this.transaction.controls['tag'].value,
      amount: this.transaction.controls['amount'].value,
      memo: this.transaction.controls['memo'].value,
      date: this.transaction.controls['date'].value,
      walletName: this.transaction.controls['walletName'].value,
    };
    let balanceObj = {
      type: this.transaction.controls['type'].value,
      amount: this.transaction.controls['amount'].value,
      walletName: this.transaction.controls['walletName'].value,
    };
    console.log("Date is ", this.transaction.controls['date'].value);
    this.sql.insertTable(transactionObj, 'Transactions');
    this.sql.updateBalance(balanceObj);
    this.viewCtrl.dismiss(true);
  }

  onDeleteTable() {
    this.sql.dropTables();
  }

  onAddTable() {
    this.sql.createTables();
  }

  async getWalletList() {
    let result = await this.sql.getWalletTable();
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('get wallet list!');
    console.log("THE RESULT IS ", result.length);
  }
}