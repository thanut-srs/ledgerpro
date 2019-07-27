import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage,ViewController, NavParams, AlertController } from 'ionic-angular';

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
    public params: NavParams,
    public sql : SqlProvider,
    public alertCtrl : AlertController,
    ) {
      this.tID = params.get('tranID')
  }

  ngOnInit() {
    console.log('In modal ID is ',this.tID);
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
  onEditTransaction(){

  }

  onDeleteTransaction(){
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
              this.viewCtrl.dismiss();
            }
          }
        ]
      });
      alert.present();
    }
}
