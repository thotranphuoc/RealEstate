import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';

import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-user-management',
  templateUrl: 'user-management.html',
})
export class UserManagementPage {
  users: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afService: AngularFireService) {
      this.afService.getList('UsersProfile').subscribe((users)=>{
        console.log(users);
        this.users = users;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserManagementPage');

  }

  go2UserProfileEdit(user){
    console.log(user, user.$key);
    this.navCtrl.push('ProfilePage',{data: user, action: 'edit-profile', uid: user.$key})
  }


}
