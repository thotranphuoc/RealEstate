import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgboxPage } from './msgbox';

@NgModule({
  declarations: [
    MsgboxPage,
  ],
  imports: [
    IonicPageModule.forChild(MsgboxPage),
  ],
  exports: [
    MsgboxPage
  ]
})
export class MsgboxPageModule {}
