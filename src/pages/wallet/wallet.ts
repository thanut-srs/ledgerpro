import { WalletDetailPage } from './../wallet-detail/wallet-detail';
import { CreateWalletPage } from './../create-wallet/create-wallet';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  ) {
  }

  async ngOnInit() {
    await this.updateWalletList();
    await this.getCurrentUser();
    console.log("Wallet collection is ",this.collection)
  }

  async updateWalletList() {
    let result = await this.sql.getWalletTable();
    this.collection = [];
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    console.log('Update wallet list!');
    console.log("THE RESULT IS ", result.length);
  }

  onDetail(wID: number){
    console.log("wID in wallet page is ",wID);
    this.navCtrl.push(WalletDetailPage,{walletID : wID});
  }

  async getCurrentUser(){
    this.user = await this.sql.getCurrentUID();
  }

  onCreateWallet(){
    this.navCtrl.push(CreateWalletPage,{uID: this.user, fromWallet: true});
  }
}
