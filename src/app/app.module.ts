import { SignupPage } from './../pages/signup/signup';
import { WelcomePage } from './../pages/welcome/welcome';
import { LoginPage } from './../pages/login/login';
import { TransactionDetailPage } from './../pages/transaction-detail/transaction-detail';
import { FirstLoginPage } from './../pages/first-login/first-login';
import { SQLite } from '@ionic-native/sqlite';
import { GoalDetailPage } from './../pages/goal-detail/goal-detail';
import { AddTransactionPage } from './../pages/add-transaction/add-transaction';
import { ComponentsModule } from './../components/components.module';
import { ProfilePage } from './../pages/profile/profile';
import { WalletPage } from './../pages/wallet/wallet';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SqlProvider } from '../providers/sql/sql';
import { DateProvider } from '../providers/date/date';
import { EditTransactionPage } from '../pages/edit-transaction/edit-transaction';
import { LoginProvider } from '../providers/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WalletPage,
    ProfilePage,
    AddTransactionPage,
    GoalDetailPage,
    FirstLoginPage,
    TransactionDetailPage,
    EditTransactionPage,
    LoginPage,
    WelcomePage,
    SignupPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WalletPage,
    ProfilePage,
    AddTransactionPage,
    GoalDetailPage,
    FirstLoginPage,
    TransactionDetailPage,
    EditTransactionPage,
    LoginPage,
    WelcomePage,
    SignupPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SqlProvider,
    SQLite,
    LoginProvider,
    LoginProvider,
  
  
  ]
})
export class AppModule {}
