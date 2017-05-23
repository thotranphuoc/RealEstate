import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemDetailPage } from './show-item-detail';

@NgModule({
  declarations: [
    ShowItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowItemDetailPage),
  ],
  exports: [
    ShowItemDetailPage
  ]
})
export class ShowItemDetailPageModule {}
