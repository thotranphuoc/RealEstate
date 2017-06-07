import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { iSetting } from '../../interfaces/setting.interface';
import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
// import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  mySettings: iSetting;
  isSigned;
  isAdmin: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.mySettings = this.dbService.getSetting();
    console.log('constructor inside')
    this.isSigned = this.afAuth.auth.currentUser;
    if (this.isSigned) {
      this.authService.isAdmin(this.afAuth.auth.currentUser.email).then((res: boolean) => {
        console.log(res);
        this.isAdmin = res;
      })
    }
    console.log(this.isSigned);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

  }

  go2AccountPage(action: string) {
    this.navCtrl.push('AccountPage', { action: action })
  }

  onSignOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        console.log('user logged out!')
      })
    this.navCtrl.setRoot('MapPage');
  }

  go2ProfilePage() {
    console.log('edit profile page');
    this.navCtrl.push('ProfilePage');
  }

  go2YourSellItemPage() {
    this.navCtrl.push('YourSellItemPage', this.afAuth.auth.currentUser.uid);
  }

  go2FavoriteViewPage() {
    this.navCtrl.push('FavoriteViewPage', this.afAuth.auth.currentUser.uid);
  }

  go2SuggestionPage(){
    this.navCtrl.push('SuggestionPage');
  }

  go2SupportPage(){
    this.navCtrl.push('SupportPage');
  }

  // ionViewWillEnter() {
  //   this.mySettings = this.dbService.getSetting();
  //   // console.log('ionViewWillEnter', this.mySettings);
  // }

  go2UserManagement() {
    this.navCtrl.push('UserManagementPage');
  }

  go2ItemManagement() {
    this.navCtrl.push('ItemManagementPage');
  }

  go2FeedbackManagement(){
    this.navCtrl.push('FeedbackManagementPage');
  }

  go2SuggestionManager(){
    this.navCtrl.push('SuggestionManagerPage')
  }


}
