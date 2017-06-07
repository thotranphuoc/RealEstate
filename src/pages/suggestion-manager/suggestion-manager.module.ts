import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestionManagerPage } from './suggestion-manager';

@NgModule({
  declarations: [
    SuggestionManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestionManagerPage),
  ],
  exports: [
    SuggestionManagerPage
  ]
})
export class SuggestionManagerPageModule {}
