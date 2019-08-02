import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { EditTransactionPage } from '../edit-transaction/edit-transaction';

/**
 * Generated class for the TransactionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html',
})
export class TransactionDetailPage {
  public tID: number;
  public collection = [];
  constructor(
    public viewCtrl: ViewController,
    private params: NavParams,
    private sql: SqlProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
    this.tID = params.get('tranID')
  }

  ngOnInit() {
    console.log('In modal ID is ', this.tID);
    this.updateTransaction();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailPage');
  }

  async updateTransaction() {
    let result = await this.sql.selectTablebyID(this.tID);
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('update transaction !');
    console.log("THE RESULT IS ", result.length);
  }
  onEditTransaction() {
    const modal = this.modalCtrl.create(EditTransactionPage, { transDetail: this.collection });
    modal.onDidDismiss((data) => {
      if (data) {
        this.updateTransaction();
        this.presentEditToast();
      }
    });
    modal.present();
  }
  presentEditToast() {
    let toast = this.toastCtrl.create({
      message: 'Transaction edited!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
  onDeleteTransaction() {
    let delFalg = true;
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this transaction?',
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
            this.sql.deleteRowById(this.tID);
            this.viewCtrl.dismiss(delFalg);
          }
        }
      ]
    });
    alert.present();
  }
}
