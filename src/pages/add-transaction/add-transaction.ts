import { SqlProvider } from './../../providers/sql/sql';
import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
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
  public year = null;
  public month = null;
  public day = null;
  public date = null;
  public currentTime = null;
  constructor(
    public viewCtrl: ViewController,
    public actionSheetCtrl:ActionSheetController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
    ) {
      
      this.transaction = this.formBuilder.group({
        date: ['', Validators.required],
        amount: ['', Validators.required],
        tag: ['', Validators.required],
        type: ['', Validators.required],
        memo: [''],
      });
  }
  ngOnInit() {
    this.currentTime = new Date();
    this.year = this.currentTime.getFullYear();
    this.month = this.currentTime.getMonth();
    this.date = this.currentTime.getDate();
    this.day = this.currentTime.getDay();
    // this.setDatePlaceholder()
  }
  setDatePlaceholder(){
    let monthList = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.month = monthList[this.month];
    this.day = dayList[this.day];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransactionPage');
  }
  onInsertTable(){
    console.log("onInsertTable #1")
    let transactionObj = {
      type: this.transaction.controls['type'].value,
       tag: this.transaction.controls['tag'].value,
       amount: this.transaction.controls['amount'].value,
       memo: this.transaction.controls['memo'].value,
       date: this.transaction.controls['date'].value,
      };
      console.log("Date is ",this.transaction.controls['date'].value);
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