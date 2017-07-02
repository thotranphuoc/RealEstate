import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TipsIosPage } from './tips-ios';

@NgModule({
  declarations: [
    TipsIosPage,
  ],
  imports: [
    IonicPageModule.forChild(TipsIosPage),
  ],
  exports: [
    TipsIosPage
  ]
})
export class TipsIosPageModule {}
