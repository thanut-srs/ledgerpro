import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the CreateGoalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-goal',
  templateUrl: 'create-goal.html',
})
export class CreateGoalPage {
  public goal: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sql:SqlProvider,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController
    ) {
      this.goal = this.formBuilder.group({
        date: ['', Validators.required],
        gName: ['', Validators.required],
        target: ['', Validators.required],
        memo: [''],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateGoalPage');
  }

  async onCreateGoal(){
    let uID = await this.sql.getCurrentUID();
    let goalObj = {
      deadline: this.goal.controls['date'].value,
      name: this.goal.controls['gName'].value,
      target: this.goal.controls['target'].value,
      memo: this.goal.controls['memo'].value,
      UID: uID
    }
    console.log("goalObj is ", goalObj);
    this.sql.insertTable(goalObj, 'Goal');
    this.viewCtrl.dismiss(true);
  }
}
