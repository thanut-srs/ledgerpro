import { CreateWalletPage } from './../create-wallet/create-wallet';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, ViewController } from 'ionic-angular';
import { EditWalletPage } from '../edit-wallet/edit-wallet';

/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-detail',
  templateUrl: 'wallet-detail.html',
})
export class WalletDetailPage {
  public wId: number;
  public uId = "";
  public collection = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sql: SqlProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
  ) {
    this.wId = navParams.get('walletID');
    console.log('this.wId = navParams.get ', navParams.get('walletID'))
  }


  ionViewDidLoad() {
    console.log('wID in wallet detail page is ', this.wId);
  }
  async ngOnInit() {
    this.getWalletData();
    this.uId = await this.sql.getCurrentUID();
  }

  async getWalletData() {
    let result = await this.sql.getWalletTableByID(this.wId);
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('get wallet data!!');
    console.log("THE RESULT IS ", result);
  }

  onEditWallet() {
    const modal = this.modalCtrl.create(EditWalletPage, { walletDetail: this.collection });
    modal.onDidDismiss((data) => {
      if (data) {
        this.getWalletData();
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
   async onDeleteWallet() {
    let delFlag = true;
    let singleFlag = null;
    if(await this.sql.checkSingleWallet(this.uId)){
      singleFlag = true;
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this wallet?',
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
            this.sql.deleteWalletById(this.wId);
            if(!singleFlag){
              this.viewCtrl.dismiss(delFlag);
            } else {
              this.viewCtrl.dismiss();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
