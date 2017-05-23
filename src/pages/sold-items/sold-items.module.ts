import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoldItemsPage } from './sold-items';

@NgModule({
  declarations: [
    SoldItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(SoldItemsPage),
  ],
  exports: [
    SoldItemsPage
  ]
})
export class SoldItemsPageModule {}
