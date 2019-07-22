import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalDetailPage } from './goal-detail';

@NgModule({
  declarations: [
    GoalDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalDetailPage),
  ],
})
export class GoalDetailPageModule {}
