import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddItemNewTab2Page } from './add-item-new-tab2';

@NgModule({
  declarations: [
    AddItemNewTab2Page,
  ],
  imports: [
    IonicPageModule.forChild(AddItemNewTab2Page),
  ],
  exports: [
    AddItemNewTab2Page
  ]
})
export class AddItemNewTab2PageModule {}
