import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportManagerPage } from './support-manager';

@NgModule({
  declarations: [
    SupportManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportManagerPage),
  ],
  exports: [
    SupportManagerPage
  ]
})
export class SupportManagerPageModule {}
