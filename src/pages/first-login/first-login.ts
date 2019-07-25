import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FirstLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-login',
  templateUrl: 'first-login.html',
})
export class FirstLoginPage {

  constructor(
    public viewCtrl: ViewController,
   ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstLoginPage');
  }

  onDidmiss(){
    this.viewCtrl.dismiss();
  }

}
