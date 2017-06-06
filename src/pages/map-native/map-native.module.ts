import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapNativePage } from './map-native';

@NgModule({
  declarations: [
    MapNativePage,
  ],
  imports: [
    IonicPageModule.forChild(MapNativePage),
  ],
  exports: [
    MapNativePage
  ]
})
export class MapNativePageModule {}
