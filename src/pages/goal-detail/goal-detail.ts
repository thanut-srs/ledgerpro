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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalDetailPage');
  }
  onCreateGoal(){
    const modal = this.modalCtrl.create(CreateGoalPage);
    modal.onDidDismiss((data) => {
      if (data) {
        // this.updateTransaction();
        this.presentCreateToast();
      }
    });
    modal.present();
  }
  presentCreateToast(){
    let toast = this.toastCtrl.create({
      message: 'Goal created!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
