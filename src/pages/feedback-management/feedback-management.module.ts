import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackManagementPage } from './feedback-management';

@NgModule({
  declarations: [
    FeedbackManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackManagementPage),
  ],
  exports: [
    FeedbackManagementPage
  ]
})
export class FeedbackManagementPageModule {}
