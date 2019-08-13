import { TransactionDetailPage } from './../transaction-detail/transaction-detail';
import { GoalDetailPage } from './../goal-detail/goal-detail';
import { AddTransactionPage } from './../add-transaction/add-transaction';

import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Slides, ToastController, MenuController } from 'ionic-angular';
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
  public uID: string;
  public selectedWallet: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public sql: SqlProvider,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(true, 'myMenu');
  }
  async ngOnInit() {
    await this.getUid();
    await this.updateTransaction();
    console.log(this.date);
    await this.getName();
    await this.getWalletList();
  }

  async getName() {
    this.currentUser = await this.sql.getNickName();
  }

  async getWalletList() {
    this.walletlist = await this.sql.getWalletListByUid(this.uID);
  }
  async getUid() {
    this.uID = await this.sql.getCurrentUID();
  }

  onAddTransaction(walletID: any) {
    const modal = this.modalCtrl.create(AddTransactionPage, { wID: walletID });
    modal.onDidDismiss(async(data) => {
      console.log("Modal is dismissed! #3");
      if (data) {
        await this.updateTransaction();
        await this.updateDate();
        this.presentAddToast();
      }
    });
    modal.present();
  }

  onClick() {
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
    console.log("THE RESULT IS ", result);
    console.log('date list is ', date);
  }

  onViewGoal() {
    console.log("click onViewGoal");
    this.navCtrl.push(GoalDetailPage);
  }

  onDetail(tID: number) {
    console.log('item id is ', tID);
    const modal = this.modalCtrl.create(TransactionDetailPage, { tranID: tID });
    modal.onDidDismiss(async (data) => {
      console.log("onDetail Modal is dismissed!");
      await this.updateTransaction();
      if (data) {
        await this.updateDate();
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

  async onChange($event) {
    console.log("selectedWallet is ", this.selectedWallet)
    this.updateDate();
  }

  async updateDate() {
    if (this.selectedWallet != 'All-Wallet') {
      console.log(this.sql.selectDistinctdateByWid(this.selectedWallet));
      this.date = await this.sql.selectDistinctdateByWid(this.selectedWallet);
    } else {
      this.date = await this.sql.selectDistinctdate();
    }
  }
}
