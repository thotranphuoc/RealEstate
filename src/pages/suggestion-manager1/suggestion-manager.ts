import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iSuggestion } from '../../interfaces/suggestion.interface';
import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-suggestion-manager',
  templateUrl: 'suggestion-manager.html',
})
export class SuggestionManagerPage {
  suggestions;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private appService: AppService,
    private afService: AngularFireService) {

      this.afService.getList('Suggestions').subscribe((suggestions)=>{
        this.suggestions = suggestions;
        console.log(this.suggestions);
        this.suggestions.forEach(suggestion => {
          switch (suggestion.state) {
            case 'SENDING':
              console.log('set state sending');
              break;
            case 'SEND_ACK':
              console.log('set state send_ack');
              break;
            default:
              console.log('set state cancel');
              break;
          }
        });
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestionManagerPage');
  }

  go2SuggestionDetail(suggestion){
    console.log(suggestion);
    this.navCtrl.push('SupportPage', {action: 'admin-view-suggest', data: suggestion});
  }
  

}
