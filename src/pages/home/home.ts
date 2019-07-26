import { GoalDetailPage } from './../goal-detail/goal-detail';
import { AddTransactionPage } from './../add-transaction/add-transaction';

import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { WalletPage } from '../wallet/wallet';
import { SqlProvider } from '../../providers/sql/sql';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public collection = [];
  public date =[];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public sql: SqlProvider
  ) {

  }
  async ngOnInit() {
    await this.sql.openDB();
    this.updateTransaction();
    console.log(this.date);
    // for(let i =0; i<2; i++){
    //   this.collection.push('H'+i);
    // }
  }

  setDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let monthList = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    // document.getElementById("date").innerHTML = day + " " + monthList[month] + " " + year;
    // document.getElementById("date").innerHTML = this.date[0];
  }

  onAddTransaction() {
    const modal = this.modalCtrl.create(AddTransactionPage);
    modal.onDidDismiss(() => {
      console.log("Modal is dismissed! #3");
      this.updateTransaction();
    });
    modal.present();
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
    console.log('update transaction !');
    console.log("THE RESULT IS ", result.length);
    console.log('date list is ',date);
  }

  onViewGoal() {
    console.log("click onViewGoal");
    this.navCtrl.push(GoalDetailPage);
  }
}
