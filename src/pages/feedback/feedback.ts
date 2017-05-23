
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { iFeedback } from '../../interfaces/feedback.interface';
// import { SigninPage } from '../../pages/signin/signin';
// import { LoginPage } from '../../pages/login/login';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {
  feedback: iFeedback;
  ITEM_KEY: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private dbService: DbService,
    private authService: AuthService,
    private appService: AppService,
    private afAuth: AngularFireAuth) {
    this.feedback = this.dbService.getFeedback();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');

  }

  sendFeedback(form) {
    
    this.ITEM_KEY = this.navParams.data;
    this.feedback.NAME = this.afAuth.auth.currentUser.email;
    this.feedback.POSTTIME = this.appService.getCurrentDataAndTime();
    this.dbService.setFeedback(this.feedback);
    if (this.afAuth.auth.currentUser) {
      this.appService.addFeedback(this.afAuth.auth.currentUser.uid, this.ITEM_KEY, this.feedback);
      this.appService.toastMsg('Thanks for your feedback', 3000);
      this.resetForm();
    } else {
      this.alertMsgWithConfirmation();
    }

  }

  alertMsgWithConfirmation() {
    this.alertCtrl.create({
      title: 'Not Signed',
      message: 'Plz login to continue',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('go2SignIn Page');
            // this.navCtrl.popToRoot();
            this.navCtrl.push('LoginPage');
          }
        }
      ]
    }).present();
  }

  resetForm() {
    this.feedback = {
      SOLDOUT: false,
      WRONGPIC: false,
      WRONGPHONE: false,
      WRONGLOCATION: false,
      WRONGPRICE: false,
      POSTTIME: null,
      COMMNENTS: null,
      NAME: null
    }

    this.dbService.setFeedback(this.feedback);
  }

}


