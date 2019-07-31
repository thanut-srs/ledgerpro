import { HomePage } from './../home/home';
import { SignupPage } from './../signup/signup';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ViewController, AlertController } from 'ionic-angular';
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
  public userNickName = "";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sql: SqlProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private login: LoginProvider,
    private alertCtrl: AlertController
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
    if(this.sessionFlag){
      this.getName();
    }
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
        this.userLogin.reset();
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

  async checkLogin(){
    console.log("onInsertTable #1")
    let username = this.userLogin.controls['username'].value;
    let password = this.userLogin.controls['password'].value;
    console.log("Username is ",username);
    console.log("Password is ",password);
    if(await this.login.checkLogin(username,password)){
      this.sql.checkWallet();
      this.navCtrl.setRoot(HomePage);
    } else {
      this.userLogin.reset();
      this.presentIncorrectPassword();
    }
  }
  
 presentIncorrectPassword() {
    let toast = this.toastCtrl.create({
      message: 'Incorrect Password!',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async getName(){
    this.userNickName = await this.sql.getNickName();
  }  

  logInWithOtherAcc(){
    let delFalg = true;
    let alert = this.alertCtrl.create({
      title: 'Logout?',
      message: 'You need to logout to login with other account, Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.login.logout();
            this.navCtrl.setRoot(WelcomePage);
          }
        }
      ]
    });
    alert.present();
  }
  onGoHome(){
    this.navCtrl.setRoot(HomePage)
  }
  onLogout(){
    this.login.logout();
    this.onGoHome();
  }
}
