import { Camera, CameraOptions } from '@ionic-native/camera';
import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public samplePic: string;
  private win: any = window;
  public name: string;
  public uID: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sql: SqlProvider,
    public camera: Camera,
    public alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  async ionViewCanEnter() {
    this.samplePic = await this.sql.getUserPicUrl();
    this.updateName();
    this.uID = await this.sql.getCurrentUID();
  }

  onEditName() {
    let alert = this.alertCtrl.create({
      title: 'Edit Name',
      inputs: [
        {
          name: 'name',
          placeholder: 'New name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.sql.updateUserNameByID(data.name, this.uID);
            this.updateName();
          }
        }
      ]
    });
    alert.present();
  }

  async updateName(){
    this.name = await this.sql.getNickName();
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
  onOpenCamera(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 400,
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
      this.updateProfile(this.samplePic, this.uID);
      console.log(this.samplePic);
    }, (err) => {
      console.log(err);
    });
  }
  async updateProfile(newPath: string, uID: string) {
    await this.sql.updateUserPicByID(newPath, uID);
  }
}
