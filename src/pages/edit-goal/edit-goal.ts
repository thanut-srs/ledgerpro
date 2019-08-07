import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-goal',
  templateUrl: 'edit-goal.html',
})
export class EditGoalPage {
  public goalDetail = [];
  public goal: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sql: SqlProvider,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    ) {
      this.goalDetail = this.navParams.get('goalDetail');
      console.log("this.goalDetail in edit-goal.ts is ",this.goalDetail)
      this.goal = this.formBuilder.group({
        deadline: [this.goalDetail[0].deadline, Validators.required],
        gName: [this.goalDetail[0].name, Validators.required],
        target: [this.goalDetail[0].target, Validators.required],
        memo: [this.goalDetail[0].memo],
      });
  }

  async onSaveGoal(){
    let goal ={
      gID: this.goalDetail[0].gID,
      name: this.goal.controls['gName'].value,
      target: this.goal.controls['target'].value,
      deadline: this.goal.controls['deadline'].value,
      memo: this.goal.controls['memo'].value
    }
    console.log("new value of goal is ",goal)
    await this.sql.updateGoalTableByID(goal);
    this.viewCtrl.dismiss(true);
  }

}
