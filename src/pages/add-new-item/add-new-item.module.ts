import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewItemPage } from './add-new-item';

@NgModule({
  declarations: [
    AddNewItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewItemPage),
  ],
  exports: [
    AddNewItemPage
  ]
})
export class AddNewItemPageModule {}
