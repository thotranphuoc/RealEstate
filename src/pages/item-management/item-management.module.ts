import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemManagementPage } from './item-management';

@NgModule({
  declarations: [
    ItemManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemManagementPage),
  ],
  exports: [
    ItemManagementPage
  ]
})
export class ItemManagementPageModule {}
