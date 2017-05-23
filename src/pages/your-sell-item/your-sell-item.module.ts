import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourSellItemPage } from './your-sell-item';

@NgModule({
  declarations: [
    YourSellItemPage,
  ],
  imports: [
    IonicPageModule.forChild(YourSellItemPage),
  ],
  exports: [
    YourSellItemPage
  ]
})
export class YourSellItemPageModule {}
