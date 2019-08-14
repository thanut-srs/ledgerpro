import { CreateWalletPage } from './../create-wallet/create-wallet';
import { HomePage } from './../home/home';
import { SignupPage } from './../signup/signup';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ViewController, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  public samplePic =  "../assets/imgs/AvatarBoy.png";
  private win: any = window;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sql: SqlProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private login: LoginProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.userLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    console.log('samplePic is ', this.samplePic);
  }
  async ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    await this.sql.openDB();
    if (await this.sql.checkFirstTime()){
      this.sql.createTables();
    }
    this.sessionFlag = await this.sql.checkSession()
    if (this.sessionFlag) {
      this.getName();
    }
    loading.dismiss();
  }
  addtable() {
    this.sql.createTables();
  }
  droptable() {
    this.sql.dropTables();
  }
  onCreateAccount() {
    const modal = this.modalCtrl.create(SignupPage);
    modal.onDidDismiss((data) => {
      console.log("Modal is dismissed! #3");
      if (data) {
        this.presentCreateAccToast();
        this.userLogin.reset();
      }
    });
    modal.present();
  }
  presentCreateAccToast() {
    let toast = this.toastCtrl.create({
      message: 'Account created!',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  async checkLogin() {
    console.log("onInsertTable #1")
    let username = this.userLogin.controls['username'].value;
    let password = this.userLogin.controls['password'].value;
    console.log("Username is ", username);
    console.log("Password is ", password);
    if (await this.login.checkLogin(username, password)) {
      if (await this.sql.checkWallet(username)) {
        this.navCtrl.setRoot(HomePage);
      } else {
        let username = this.userLogin.controls['username'].value;
        console.log('checkLogin username is ', username);
        this.navCtrl.setRoot(CreateWalletPage, { fromWallet: false });
      }
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

  async getName() {
    this.userNickName = await this.sql.getNickName();
  }

  logInWithOtherAcc() {
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
  async onGoHome() {
    if (await this.sql.checkWallet(await this.sql.getCurrentUID())) {
      this.navCtrl.setRoot(HomePage);
    } else {
      let username = await this.sql.getCurrentUID();
      console.log('checkLogin username is (onGoHome) ', username);
      this.navCtrl.push(CreateWalletPage, { uID: username, fromWallet: false });
    }
  }

  onLogout() {
    this.login.logout();
    this.navCtrl.setRoot(WelcomePage);
  }

  onOpenCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image);
      this.samplePic = this.win.Ionic.WebView.convertFileSrc(imageData);
      console.log(this.samplePic);
    }, (err) => {
      console.log(err);
    });
  }
}
