import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddItemNewPage } from './add-item-new';

@NgModule({
  declarations: [
    AddItemNewPage,
  ],
  imports: [
    IonicPageModule.forChild(AddItemNewPage),
  ],
  exports: [
    AddItemNewPage
  ]
})
export class AddItemNewPageModule {}
