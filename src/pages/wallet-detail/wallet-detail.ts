import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  public collection = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sql: SqlProvider,
  ) {
    this.wId = navParams.get('walletID');
    console.log('this.wId = navParams.get ', navParams.get('walletID'))
  }


  ionViewDidLoad() {
    console.log('wID in wallet detail page is ', this.wId);
  }
  ngOnInit() {
    this.getWalletData();
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
}
