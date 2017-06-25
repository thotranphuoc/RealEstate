import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddItemNewTab1Page } from './add-item-new-tab1';

@NgModule({
  declarations: [
    AddItemNewTab1Page,
  ],
  imports: [
    IonicPageModule.forChild(AddItemNewTab1Page),
  ],
  exports: [
    AddItemNewTab1Page
  ]
})
export class AddItemNewTab1PageModule {}
