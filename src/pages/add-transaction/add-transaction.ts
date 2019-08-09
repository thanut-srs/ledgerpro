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
  public goalList = [];
  private uID: string;
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
  ) {
    this.transaction = this.formBuilder.group({
      date: [this.currentDate, Validators.required],
      amount: ['', Validators.required],
      tag: ['', Validators.required],
      walletID: ['', Validators.required],
      type: ['', Validators.required],
      goalID: ['', Validators.required],
      memo: [''],
    });
  }
  async ngOnInit() {
    this.setDate();
    this.uID = await this.sql.getCurrentUID();
    await this.getWalletList();
    await this.getGoalList();
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
    let tType = this.transaction.controls['type'].value;
    let gId = this.transaction.controls['goalID'].value;
    let tAmount = this.transaction.controls['amount'].value;
    console.log("onInsertTable #1")
    let transactionObj = {
      type: this.transaction.controls['type'].value,
      tag: this.transaction.controls['tag'].value,
      amount: this.transaction.controls['amount'].value,
      memo: this.transaction.controls['memo'].value,
      date: this.transaction.controls['date'].value,
      wID: this.transaction.controls['walletID'].value,
      goalID: this.transaction.controls['goalID'].value,
    };
    let balanceObj = {
      type: this.transaction.controls['type'].value,
      amount: this.transaction.controls['amount'].value,
      walletID: this.transaction.controls['walletID'].value,
    };
    this.sql.insertTable(transactionObj, 'Transactions');
    this.sql.updateBalance(balanceObj);
    if (tType == "Saving") {
      console.log("tType is saving!")
      this.sql.updateGoalTarget(gId, tAmount);
    }
    this.viewCtrl.dismiss(true);
  }

  onDeleteTable() {
    this.sql.dropTables();
  }

  onAddTable() {
    this.sql.createTables();
  }

  async getWalletList() {
    let result = await this.sql.getWalletListByUid(this.uID);
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('get wallet list!');
    console.log("THE RESULT IS ", result);
  }

  async getGoalList() {
    let result = await this.sql.getGoal();
    this.goalList = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].gStatus != 'Achieved') {
        this.goalList.push(result[i]);
      }
    }
    console.log('get goal list!');
    console.log("THE RESULT IS ", result);
  }

  onChange($event) {
    if (($event) == 'Income' || ($event) == 'Expense') {
      console.log("You select income or expense!!")
      this.transaction.controls['goalID'].disable()
      this.transaction.controls['tag'].enable()
    } else {
      console.log("You select saving!!")
      this.transaction.controls['tag'].disable()
      this.transaction.controls['goalID'].enable()
    }
  }
}