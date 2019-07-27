import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';

/**
 * Generated class for the EditTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage {
  public transaction: FormGroup;
  public currentDate: string;
  public transDetail = [];
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
    private params: NavParams,
  ) {
    this.transDetail = params.get('transDetail')
    this.transaction = this.formBuilder.group({
      date: [this.transDetail[0].date, Validators.required],
      amount: [this.transDetail[0].amount, Validators.required],
      tag: [this.transDetail[0].tag, Validators.required],
      type: [this.transDetail[0].type, Validators.required],
      memo: [this.transDetail[0].memo],
    });
  }
  // setDatePlaceholder(){
  //   let monthList = ["January", "February", "March", "April", "May", "June",
  //     "July", "August", "September", "October", "November", "December"
  //   ];
  //   let dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //   this.month = monthList[this.month];
  //   this.day = dayList[this.day];
  // }

  setDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = ("0" + date.getDate()).slice(-2)
    let currentDay = year+"-"+month+"-"+day;
    this.currentDate = currentDay;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTransactionPage');
  }

  onUpdateTable(){
    console.log("ononUpdateTable")
    let transactionObj = {
      type: this.transaction.controls['type'].value,
       tag: this.transaction.controls['tag'].value,
       amount: this.transaction.controls['amount'].value,
       memo: this.transaction.controls['memo'].value,
       date: this.transaction.controls['date'].value,
      };
      console.log(" New data is ",transactionObj);
      this.sql.updateTableByID(transactionObj, this.transDetail[0].tID);
      this.viewCtrl.dismiss();
  }

}
