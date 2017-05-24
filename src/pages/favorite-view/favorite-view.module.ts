import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteViewPage } from './favorite-view';

@NgModule({
  declarations: [
    FavoriteViewPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteViewPage),
  ],
  exports: [
    FavoriteViewPage
  ]
})
export class FavoriteViewPageModule {}
