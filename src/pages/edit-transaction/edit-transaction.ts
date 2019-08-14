import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';
import { e } from '@angular/core/src/render3';

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
  public currentType: string;
  public currentGoal: string;
  public goalList = [];
  public walletID: any
  public walletList = [];
  public walletName: string;
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
      walletID: [this.transDetail[0].wID, Validators.required],
      goalID: [this.transDetail[0].gID, Validators.required],
      type: [this.transDetail[0].type, Validators.required],
      memo: [this.transDetail[0].memo],
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTransactionPage');
    this.currentType = this.transDetail[0].type;
    if (this.currentType == 'Saving') {
      this.transaction.controls['tag'].disable()
    } else {
      this.transaction.controls['goalID'].disable()
    }
    this.currentGoal = this.transDetail[0].goalName;
  }
  async ngOnInit() {
    let uid = await this.sql.getCurrentUID();
    this.goalList = await this.sql.getGoal();
    this.walletName = await this.sql.getWalletName(this.transDetail[0].wID);
    this.walletList = await this.sql.getWalletListByUid(uid);
  }
  onUpdateTable() {
    console.log("ononUpdateTable")
    let editFlag = true;
    let transactionObj = {
      type: this.transaction.controls['type'].value,
      tag: this.transaction.controls['tag'].value,
      amount: this.transaction.controls['amount'].value,
      memo: this.transaction.controls['memo'].value,
      date: this.transaction.controls['date'].value,
      wID: this.transaction.controls['walletID'].value,
      gID: this.transaction.controls['goalID'].value,
    };
    console.log(" New data is ", transactionObj);
    this.sql.updateTableByID(transactionObj, this.transDetail);
    this.viewCtrl.dismiss(editFlag);
  }
  onPrint() {
    console.log(this.transaction);
  }
}
