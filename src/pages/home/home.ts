import { GoalDetailPage } from './../goal-detail/goal-detail';
import { AddTransactionPage } from './../add-transaction/add-transaction';

import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { WalletPage } from '../wallet/wallet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public collection = [];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {

  }
  ngOnInit() {
    this.setDate();
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
    document.getElementById("date").innerHTML = day + " " + monthList[month] + " " + year;
  }

  onAddTransaction() {
    const modal = this.modalCtrl.create(AddTransactionPage);
    modal.present();
  }


  onViewGoal() {
    console.log("click onViewGoal");
    this.navCtrl.push(GoalDetailPage);
  }
}
