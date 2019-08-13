import { Validators } from '@angular/forms';
import { CreateWalletPage } from './../create-wallet/create-wallet';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController, AlertController, ViewController, MenuController } from 'ionic-angular';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  public collection = [];
  public user = "";
  constructor(
    private sql: SqlProvider,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public menuCtrl: MenuController,
    ) {
      this.menuCtrl.enable(true, 'myMenu');
    }

  async ngOnInit() {
    await this.getCurrentUser();
    await this.updateWalletList();
    console.log("Wallet collection is ", this.collection)
  }

  async updateWalletList() {
    let result = await this.sql.getWalletListByUid(this.user);
    let allWList = await this.sql.getWalletTable();
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('Update wallet list!');
    console.log("THE RESULT IS ", result);
    console.log("THE WALLETS ARE ", allWList);
  }

  async getCurrentUser() {
    this.user = await this.sql.getCurrentUID();
  }

  onCreateWallet() {
    this.navCtrl.push(CreateWalletPage, { uID: this.user, fromWallet: true });
  }

  presentDeleteToast() {
    let toast = this.toastCtrl.create({
      message: 'Wallet deleted!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  onEditWallet(walletDetail: any,msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Edit Wallet',
      message: msg,
      inputs: [
        {
          name: 'name',
          value: walletDetail.wName,
          placeholder: "Wallet's name",
          type: 'text',
          max: 20
        },
        {
          name: 'balance',
          type: 'number',
          placeholder: "Wallet's Balance",
          value: '' + walletDetail.balance
          
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let wallet = {
              wID: walletDetail.wID,
              name: data.name,
              balance: parseInt(data.balance)
            }
            if (data.name.trim() == "" || data.balance.trim() == "" || data.balance < 0)  {
              this.onEditWallet(walletDetail,'Invalid information, please fill again.');
            } else {
              this.sql.updateWalletTableByID(wallet);
              this.updateWalletList();
              this.presentEditToast();
            }
          }
        }
      ]
    });
    alert.present();
  }

  

  presentEditToast() {
    let toast = this.toastCtrl.create({
      message: 'Wallet Updated!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  async onDeleteWallet(wId: number, walletName: string) {
    let singleFlag = null;
    if (await this.sql.checkSingleWallet(this.user)) {
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
            this.sql.deleteWallet(wId, walletName);
            if (singleFlag) {
              this.navCtrl.setRoot(CreateWalletPage, { uID: this.user, fromWallet: false });
            } else {
              this.updateWalletList();
              this.presentDeleteToast();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
