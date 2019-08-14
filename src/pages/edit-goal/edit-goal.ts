import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-goal',
  templateUrl: 'edit-goal.html',
})
export class EditGoalPage {
  public goalDetail = [];
  public goal: FormGroup;
  public walletList = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sql: SqlProvider,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.goalDetail = this.navParams.get('goalDetail');
    console.log("this.goalDetail in edit-goal.ts is ", this.goalDetail)
    this.goal = this.formBuilder.group({
      deadline: [this.goalDetail[0].deadline, Validators.required],
      gName: [this.goalDetail[0].name, Validators.required],
      target: [this.goalDetail[0].target, Validators.required],
      memo: [this.goalDetail[0].memo],
    });
  }

  async ngOnInit() {
    await this.getWalletID();
    console.log('this.walletList is ', this.walletList)
  }

  async onSaveGoal() {
    // <-- create obj for update table -->
    let goal = {
      gID: this.goalDetail[0].gID,
      name: this.goal.controls['gName'].value,
      target: this.goal.controls['target'].value,
      deadline: this.goal.controls['deadline'].value,
      memo: this.goal.controls['memo'].value
    }
    console.log("new value of goal is ", goal)
    let remain = await this.sql.checkGoalNewTarget(goal.gID, goal.target)
    console.log("#### REMAIN IS ", remain, " ####")
    if (remain > 0) {
      await this.alertBox(remain,`You have excess from editing wallet (` + remain + ` Baht), 
      which wallet do you want to keep them ?`);
    } else if (remain === 0) {
      this.sql.changeGoalStatus("Achieved", goal.gID)
      this.sql.pushNotification("Congratulation! your goal is achieved.");
    }
    await this.sql.updateGoalTableByID(goal);
    this.viewCtrl.dismiss(true);
  }

  async getWalletID() {
    let wList = await this.sql.getWalletListByUid(await this.sql.getCurrentUID());
    console.log('wList is ', wList)
    for (let i = 0; i < wList.length; i++) {
      this.walletList.push({ wID: wList[i].wID, wName: wList[i].name });
    }
  }

  async alertBox(remain: any,msg: string) {
    let options = {
      title: 'Choose wallet',
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (data == "") {
              this.alertBox(remain,'You have to choose wallet!');
            }
            console.log(data);
            this.sql.updateWalletBalanceByID(data, remain);
          }
        }
      ],
      inputs: []
    };
    options.inputs = [];
    for (let i = 0; i < this.walletList.length; i++) {
      options.inputs.push({
        name: 'options',
        value: this.walletList[i].wID,
        label: this.walletList[i].wName,
        type: 'radio'
      });
    }
    let alert = this.alertCtrl.create(options);
    alert.present();
  }
}
