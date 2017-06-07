import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iSupport } from '../../interfaces/support.interface';
import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  problemType: string;
  problem: iSupport = { type: null, title: null, content: null, userID: null, date: null, state: null };
  action: string = 'new-support';
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

    if (this.action == 'new-support') {
      // new-support
      console.log('new-support');
    } else {
      // view-support
      console.log(this.action, 'view-support');
      this.problem = this.navParams.get('data');
      console.log(this.problem);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

  selectProblemType(problemType) {
    if (this.problemType == problemType) {
      this.problemType = null;
    } else {
      this.problemType = problemType;
    }

    console.log(this.problemType);
  }

  sendSupport(type) {
    this.problem.type = type;
    this.problem.date = this.appService.getCurrentDate();
    this.problem.userID = this.afService.getAuth().auth.currentUser.uid;
    this.problem.state = 'OPENING';
    console.log(this.problem);

    this.afService.addItem2List('SupportReq', this.problem)
      .then((res) => {
        console.log(res);
        this.afService.updateItemInList('SupportReqFromUser/' + this.problem.userID, res.key, { date: this.problem.date })
          .then(() => {
            this.problem = { type: null, title: null, content: null, userID: null, date: null, state: null };
            this.appService.toastMsg('Your request was sent successfull to out team. We will feedback soon', 10000);
            this.navCtrl.setRoot('MapPage');
          })
      })
  }

  setState(userID, key, state) {
    if (state == 'DELETE') {
      this.afService.deleteItemFromList('SupportReq', key);
      this.afService.deleteItemFromList('SupportReqFromUser/' + userID, key);
      console.log('delete done!');
      this.navCtrl.pop();
    } else {
      this.afService.updateObjectData('SupportReq/' + key, { state: state })
        .then(() => {
          console.log('update done!');
          this.navCtrl.pop();
        })
    }
  }

}
