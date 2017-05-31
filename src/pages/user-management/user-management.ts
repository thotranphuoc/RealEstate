import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';

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
    private actionSheetCtrl: ActionSheetController,
    private afService: AngularFireService,
    private appService: AppService ) {
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

  activate(key){
    console.log(key);
    this.afService.updateObjectData('UsersProfile/'+key, { STATE: 'ACTIVE'})
  }

  deactivate(key){
    console.log(key);
    this.afService.updateObjectData('UsersProfile/'+key, { STATE: 'DEACTIVE'})
  }

  deleteUser(key){
    console.log(key);
    this.appService.deleteUser(key);

  }

  deleteItems(key){
    this.appService.deleteAllSoldItemsOfUser(key);
  }

  showMore(key){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteUser(key);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


}
