import { GoalDetailPage } from './../goal-detail/goal-detail';
import { AddTransactionPage } from './../add-transaction/add-transaction';

import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Slides } from 'ionic-angular';
import { WalletPage } from '../wallet/wallet';
import { SqlProvider } from '../../providers/sql/sql';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  public collection = [];
  public date =[];
  public currentDate;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public sql: SqlProvider,
  ) {

  }
  async ngOnInit() {
    this.setDate();
    await this.sql.openDB();
    this.updateTransaction();
    console.log(this.date);
  }

  setDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = ("0" + date.getDate()).slice(-2)
    let monthList = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let currentDay = year+"-"+month+"-"+day;
    this.currentDate = currentDay;
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

  onDetail(msg: string){
    console.log('item id is ',msg);
    const modal = this.modalCtrl.create(AddTransactionPage);
    modal.onDidDismiss(() => {
      console.log("Modal is dismissed! #3");
      this.updateTransaction();
    });
    modal.present();
  }
}
