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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private afService: AngularFireService) {
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
    this.problem.state = 'SENDING';
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

}
