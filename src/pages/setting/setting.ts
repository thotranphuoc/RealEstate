import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { iSetting } from '../../interfaces/setting.interface';
import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  mySettings: iSetting;
  isSigned;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private afAuth: AngularFireAuth
  ) {
      this.mySettings = this.dbService.getSetting();
      console.log('constructor inside')
      this.isSigned = this.afAuth.auth.currentUser;
      console.log(this.isSigned);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

  }

  go2AccountPage(action: string){
    this.navCtrl.push('AccountPage', { action: action })
  }

  onSignOut(){
    this.afAuth.auth.signOut()
    .then(()=>{
      console.log('user logged out!')
    })
    this.navCtrl.push('MapPage');
  }

  go2ProfilePage(){
    console.log('edit profile page');
    this.navCtrl.push('ProfilePage');
  }

  go2YourSellItemPage(){
    this.navCtrl.push('YourSellItemPage', this.afAuth.auth.currentUser.uid);
  }

  go2FavoriteViewPage(){
    this.navCtrl.push('FavoriteViewPage', this.afAuth.auth.currentUser.uid);
  }

  // ionViewWillEnter() {
  //   this.mySettings = this.dbService.getSetting();
  //   // console.log('ionViewWillEnter', this.mySettings);
  // }

}
