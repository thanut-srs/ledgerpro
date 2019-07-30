import { SqlProvider } from './../../providers/sql/sql';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sql: SqlProvider) {
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
}
