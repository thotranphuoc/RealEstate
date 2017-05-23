import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverInfoPage } from './popover-info';

@NgModule({
  declarations: [
    PopoverInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverInfoPage),
  ],
  exports: [
    PopoverInfoPage
  ]
})
export class PopoverInfoPageModule {}
