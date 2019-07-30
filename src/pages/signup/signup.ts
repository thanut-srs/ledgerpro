import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public userInfo: FormGroup;
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
  ) {
    this.userInfo = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      nickname: ['', Validators.required],
      picUrl: [''],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  onInsertTable(){
    console.log("onInsertTable #1")
    let insertFlage = true;
    let usersObj = {
      ID: this.userInfo.controls['username'].value,
      PW: this.userInfo.controls['password'].value,
      name: this.userInfo.controls['nickname'].value,
      picUrl: this.userInfo.controls['picUrl'].value
      };
      this.sql.insertTable(usersObj,'Users');
      this.viewCtrl.dismiss(insertFlage);
  }
}
