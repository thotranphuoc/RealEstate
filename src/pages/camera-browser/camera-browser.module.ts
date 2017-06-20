import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraBrowserPage } from './camera-browser';

@NgModule({
  declarations: [
    CameraBrowserPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraBrowserPage),
  ],
  exports: [
    CameraBrowserPage
  ]
})
export class CameraBrowserPageModule {}
