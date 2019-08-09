import { WalletPage } from './../wallet/wallet';
import { HomePage } from './../home/home';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletPage {
  public uID = "";
  public wallet: FormGroup;
  public fromWallet = null;
  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public sql: SqlProvider,
    public formBuilder: FormBuilder
  ) {
    this.fromWallet = params.get('fromWallet')
    this.wallet = this.formBuilder.group({
      name: ['', Validators.required],
      balance: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.uID = await this.sql.getCurrentUID();
  }

  ionViewDidLoad() {
    console.log("this.uID in create-wallet.ts is ",this.uID);
    console.log('ionViewDidLoad CreateWalletPage');
  }
  onCreateWallet() {
    let walletObj = {
      uID: this.uID,
      name: this.wallet.controls['name'].value,
      balance: this.wallet.controls['balance'].value,
    };
    console.log('walletObj is ', walletObj);
    this.sql.insertTable(walletObj, 'Wallet');
    if(this.fromWallet){
      this.navCtrl.setRoot(WalletPage)
    } else {
      this.navCtrl.setRoot(HomePage)
    }
  }
}
