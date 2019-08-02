import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDetailPage } from './wallet-detail';

@NgModule({
  declarations: [
    WalletDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDetailPage),
  ],
})
export class WalletDetailPageModule {}
