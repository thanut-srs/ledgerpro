import { EditGoalPage } from './../edit-goal/edit-goal';
import { SqlProvider } from './../../providers/sql/sql';
import { CreateGoalPage } from './../create-goal/create-goal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

/**
 * Generated class for the GoalDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goal-detail',
  templateUrl: 'goal-detail.html',
})
export class GoalDetailPage {
  public collection = [];
  public uid: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public sql: SqlProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalDetailPage');
  }

  async ngOnInit() {
    await this.updateGoal();
    this.uid = await this.sql.getCurrentUID();
  }

  onCreateGoal() {
    const modal = this.modalCtrl.create(CreateGoalPage);
    modal.onDidDismiss((data) => {
      if (data) {
        this.updateGoal();
        this.presentToast("Goal created");
      }
    });
    modal.present();
  }

  async updateGoal() {
    let result = await this.sql.getGoal();
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('Update goal list!');
    console.log("THE RESULT IS ", result);
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
  
  async onEditGoal(gID: number){
    let goalData = await this.sql.getGoalById(gID);
    console.log("goalData is ",goalData)
    const modal = this.modalCtrl.create(EditGoalPage,{goalDetail: goalData});
    modal.onDidDismiss((data) => {
      if (data) {
        this.updateGoal();
        this.presentToast("Goal updated");
      }
    });
    modal.present();
  }
}
