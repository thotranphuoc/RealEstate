import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iSuggestion } from '../../interfaces/suggestion.interface';
import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';
@IonicPage()
@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html',
})
export class SuggestionPage {
  suggestion: iSuggestion = {
    title: null,
    content: null,
    date: null,
    userID: null,
    state: null
  }
  action: string = 'new-suggestion';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private afService: AngularFireService) {
    // action: add-new or update-item
    let Act = this.navParams.get('action');
    if (typeof (Act) != 'undefined') {
      this.action = Act;
    }

    if(this.action == 'new-suggestion'){
      // new-suggestion
      console.log('new-suggestion');
    }else{
      // view-suggestion
      console.log('view-suggestion');
      this.suggestion = this.navParams.get('data');
      console.log(this.suggestion);

    }
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestionPage');
  }

  sendSuggestion() {
    console.log(this.suggestion);
    this.suggestion.date = this.appService.getCurrentDate();
    this.suggestion.userID = this.afService.getAuth().auth.currentUser.uid;
    this.suggestion.state = 'SENDING';

    this.afService.addItem2List('Suggestions', this.suggestion).then((res)=>{
      console.log(res);
      this.afService.updateItemInList('SuggestionsFromUser/' + this.suggestion.userID, res.key, {date: this.suggestion.date});
    })
    
  }

  setState(key, state){
    this.afService.updateObjectData('Suggestions/'+key, {state: state})
    .then(()=>{
      console.log('update done!');
      this.navCtrl.pop();
    })
  }

}
