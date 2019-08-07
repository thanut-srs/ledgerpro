import { TransactionDetailPage } from './../transaction-detail/transaction-detail';
import { GoalDetailPage } from './../goal-detail/goal-detail';
import { AddTransactionPage } from './../add-transaction/add-transaction';

import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Slides, ToastController } from 'ionic-angular';
import { WalletPage } from '../wallet/wallet';
import { SqlProvider } from '../../providers/sql/sql';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  public collection = [];
  public date = [];
  public walletlist = [];
  public currentDate;
  public currentUser = "";
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public sql: SqlProvider,
    public toastCtrl: ToastController,
  ) {

  }
  async ngOnInit() {
    this.updateTransaction();
    console.log(this.date);
    await this.getName();
    await this.getWalletList();
  }

  async getName(){
    this.currentUser = await this.sql.getNickName();
  }  

  async getWalletList(){
    this.walletlist = await this.sql.getWalletTable();
  }
  onAddTransaction() {
    const modal = this.modalCtrl.create(AddTransactionPage);
    modal.onDidDismiss((data) => {
      console.log("Modal is dismissed! #3");
      if (data) {
        this.updateTransaction();
        this.presentAddToast();
      }
    });
    modal.present();
  }

  onClick(){
    console.log("Menu Clicked!");
  }

  async updateTransaction() {
    console.log("Update Transaction #4");
    let result = await this.sql.selectTable();
    let date = await this.sql.selectDistinctdate();
    console.log("let result has value #8");
    this.collection = [];
    this.date = date;
    for (let i = 0; i < result.length; i++) {
      this.collection.push(result[i]);
    }
    this.collection.reverse();
    console.log('update transaction !');
    console.log("THE RESULT IS ", result.length);
    console.log('date list is ', date);
  }

  onViewGoal() {
    console.log("click onViewGoal");
    this.navCtrl.push(GoalDetailPage);
  }

  onDetail(tID: number) {
    console.log('item id is ', tID);
    const modal = this.modalCtrl.create(TransactionDetailPage, { tranID: tID });
    modal.onDidDismiss((data) => {
      console.log("onDetail Modal is dismissed!");
      this.updateTransaction();
      if (data) {
        this.presentDeleteToast();
      }
    });
    modal.present();
  }
  presentDeleteToast() {
    let toast = this.toastCtrl.create({
      message: 'Transaction deleted!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  presentAddToast() {
    let toast = this.toastCtrl.create({
      message: 'Transaction saved!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

}
