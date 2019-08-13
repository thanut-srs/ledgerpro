import { EditGoalPage } from './../edit-goal/edit-goal';
import { SqlProvider } from './../../providers/sql/sql';
import { CreateGoalPage } from './../create-goal/create-goal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, ViewController, MenuController } from 'ionic-angular';

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
  public walletList = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public sql: SqlProvider,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public menuCtrl: MenuController,
    ) {
      this.menuCtrl.enable(true, 'myMenu');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalDetailPage');
  }

  async ngOnInit() {
    await this.updateGoal();
    await this.getWalletID();
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
    this.collection.reverse();
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

  async onEditGoal(gID: number) {
    let goalData = await this.sql.getGoalById(gID);
    console.log("goalData is ", goalData)
    const modal = this.modalCtrl.create(EditGoalPage, { goalDetail: goalData });
    modal.onDidDismiss((data) => {
      if (data) {
        this.updateGoal();
        this.presentToast("Goal updated");
      }
    });
    modal.present();
  }

  async onDeleteGoal(gID: number) {
    let gStatus = await this.sql.getGoalStatusByID(gID);
    let amount = await this.sql.getAmountByID(gID);
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this goal?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log("##### THIS GOAL IS ", gStatus, " #####");
            if (gStatus == "Achieved" || amount == 0) {
              this.sql.deleteGoalByID(gID);
            } else {
              let options = {
                title: 'Choose wallet',
                message: `You have excess from editing wallet (` + amount + ` Baht), 
                        which wallet do you want to keep them ?`,
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                      alert.dismiss();
                    }
                  },
                  {
                    text: 'Ok',
                    handler: data => {
                      console.log(data);
                      this.sql.updateWalletBalanceByID(data, amount);
                      this.sql.deleteGoalByID(gID);
                      this.updateGoal();
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
        }
      ]
    });
    alert.present();
    alert.onDidDismiss(() => {
      console.log("ALERT IS DISMISSED")
      this.updateGoal();
    });
  }
  async getWalletID() {
    let wList = await this.sql.getWalletTable();
    console.log('wList is ', wList)
    for (let i = 0; i < wList.length; i++) {
      this.walletList.push({ wID: wList[i].wID, wName: wList[i].name });
    }
  }
}
