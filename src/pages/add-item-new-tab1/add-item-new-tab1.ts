import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iProfile } from '../../interfaces/profile.interface';

import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';

@IonicPage()
@Component({
  selector: 'page-add-item-new-tab1',
  templateUrl: 'add-item-new-tab1.html',
})
export class AddItemNewTab1Page {
  loading: any;
  profile: iProfile;
  soldItem: iSoldItem;

  // INFO tab
  convertedPrice: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService,) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.soldItem = this.dbService.getSoldItem();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab1Page');
    // if (this.afService.getAuth().auth.currentUser) {
    //   this.afService.getObject('UsersProfile/' + this.afService.getAuth().auth.currentUser.uid).subscribe((profile) => {
    //     this.profile = profile;
    //     console.log(this.profile);
    //     // console.log(profile.$key);
    //     this.updateUserInfo2SoldItem()

    //   })
    // }
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter ');
    if (this.afService.getAuth().auth.currentUser) {
      this.afService.getObject('UsersProfile/' + this.afService.getAuth().auth.currentUser.uid).subscribe((profile) => {
        this.profile = profile;
        console.log(this.profile);
        // console.log(profile.$key);
        this.updateUserInfo2SoldItem()

      })
    }
  }

  updateUserInfo2SoldItem(){
    this.soldItem.NAME = this.profile.NAME;
        this.soldItem.PHONE = this.profile.TEL;
        this.soldItem.AVATAR_URL = this.profile.AVATAR_URL;
        this.dbService.setSoldITem(this.soldItem);
  }

  onKeyUp() {
    console.log(this.soldItem.PRICE);
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
  }

}
