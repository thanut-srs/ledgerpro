import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
  public samplePic = "../assets/imgs/AvatarBoy.png";
  private win: any = window;
  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider,
    public camera: Camera,
    public alertCtrl: AlertController,
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
      picUrl: this.samplePic
      };
      this.sql.insertTable(usersObj,'Users');
      this.viewCtrl.dismiss(insertFlage);
  }

  onOpenCamera(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      saveToPhotoAlbum: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:sourceType,
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

  picAlert() {
    let alert = this.alertCtrl.create({
      title: 'Change Photo',
      message: 'Do you want to change a new picture?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Take a photo',
          handler: () => {
            this.onOpenCamera(1);
          }
        },
        {
          text: 'Upload a pic',
          handler: () => {
            this.onOpenCamera(0);
          }
        }
      ]
    });
    alert.present();
  }
}
