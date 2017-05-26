import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemInMapPage } from './show-item-in-map';

@NgModule({
  declarations: [
    ShowItemInMapPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowItemInMapPage),
  ],
  exports: [
    ShowItemInMapPage
  ]
})
export class ShowItemInMapPageModule {}
