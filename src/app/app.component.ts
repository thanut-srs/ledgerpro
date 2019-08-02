import { LoginProvider } from './../providers/login/login';
import { WelcomePage } from './../pages/welcome/welcome';
import { SQLite } from '@ionic-native/sqlite';
import { LoginPage } from './../pages/login/login';
import { SqlProvider } from './../providers/sql/sql';
import { ProfilePage } from './../pages/profile/profile';
import { WalletPage } from './../pages/wallet/wallet';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public sql: SqlProvider,
    public sqlite: SQLite,
    public login: LoginProvider,
    public app: App,
    public alertCtrl: AlertController,
  ) {
    this.initializeApp();
    this.rootPage = WelcomePage;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Wallet', component: WalletPage },
      { title: 'Profile', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();                
      // Checks if can go back before show up the alert
      if(activeView.isFirst) {
          if (nav.canGoBack()){
              nav.pop();
          } else {
              const alert = this.alertCtrl.create({
                  title: 'Exit app?',
                  message: 'Exit app?',
                  buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        this.nav.setRoot('HomePage');
                      }
                  },{
                      text: 'Exit',
                      handler: () => {
                        this.platform.exitApp();
                      }
                  }]
              });
              alert.present();
          }
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout(){
    this.login.logout();
    this.nav.setRoot(WelcomePage);
  }
}
