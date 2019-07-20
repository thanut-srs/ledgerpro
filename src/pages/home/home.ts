import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public collection = [];
  constructor(public navCtrl: NavController) {

  }
  ngOnInit() {
    this.setDate();
    // for(let i =0; i<2; i++){
    //   this.collection.push('H'+i);
    // }
  }

  setDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
    document.getElementById("date").innerHTML = day + " " + monthList[month] + " " + year;
  }
}
