import { SignupPage } from './../signup/signup';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  public sessionFlag = false;
  public userLogin: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sql: SqlProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private login: LoginProvider,
    ) {
      this.userLogin = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
  async ngOnInit() {
    await this.sql.openDB();
    this.sessionFlag = await this.sql.checkSession()
  }
  addtable(){
    this.sql.createTables();
  }
  droptable(){
    this.sql.dropTables();
  }
  onCreateAccount(){
    const modal = this.modalCtrl.create(SignupPage);
    modal.onDidDismiss((data) => {
      console.log("Modal is dismissed! #3");
      if(data){
        this.presentCreateAccToast();
      }
    });
    modal.present();
  }
  presentCreateAccToast(){
    let toast = this.toastCtrl.create({
      message: 'Account created!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  checkLogin(){
    console.log("onInsertTable #1")
    let insertFlage = true;
    let username = this.userLogin.controls['username'].value;
    let password = this.userLogin.controls['password'].value;
    console.log("Username is ",username);
    console.log("Password is ",password);
    this.login.checkLogin(username,password);
  }  
}
