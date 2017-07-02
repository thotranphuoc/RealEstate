import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TipsAndroidPage } from './tips-android';

@NgModule({
  declarations: [
    TipsAndroidPage,
  ],
  imports: [
    IonicPageModule.forChild(TipsAndroidPage),
  ],
  exports: [
    TipsAndroidPage
  ]
})
export class TipsAndroidPageModule {}
