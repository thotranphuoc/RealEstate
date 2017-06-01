import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';

import { AngularFireAuth } from 'angularfire2/auth';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';
import { AuthService } from '../../services/auth.service';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iFeedback } from '../../interfaces/feedback.interface';
import { iFavorite } from '../../interfaces/favorite.interface';

@IonicPage()
@Component({
  selector: 'page-show-item-detail',
  templateUrl: 'show-item-detail.html',
})
export class ShowItemDetailPage {
  objKey: { key: string, data: iSoldItem } = null;
  obj: iSoldItem = null;
  data: any;
  key: string;
  photos: string[];
  feedbacks: any[] = [];
  NUM_OF_LOVE: number = 0;
  isNUM_OF_LOVE: boolean = false;
  NUM_OF_COMMENTS: number = 0;
  isNUM_OF_COMMENTS: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private callNumber: CallNumber
  ) {
    this.objKey = this.navParams.data;
    this.key = this.objKey.key
    this.obj = this.objKey.data;
    this.obj['new_PRICE'] = this.appService.convertToCurrency(this.obj.PRICE.toString(), ',');
    this.obj['new_KIND'] = this.appService.convertCodeToDetail(this.obj.KIND);
    this.photos = this.obj.PHOTOS;

    // FEEDBACK of item from USERS
    this.getFeedbackOfItemFromUsers();
    this.getNumberLoveOfItemFromUsers();
    this.getNumberFeedbackOfItemFromUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowItemDetailPage');
  }

  getFeedbackOfItemFromUsers() {
    this.dbService.getItemsFromFBReturnPromise('FeedbackOfItemFromUsers/' + this.key)
      .then((snapShot) => {
        snapShot.forEach(_childSnap => {
          let key = _childSnap.key;
          let data = _childSnap.val();
          let item = {
            key: key,
            data: data
          }
          console.log(item);
          this.feedbacks.push(item);
          return false;
        });
        console.log('feedbacks: ', this.feedbacks);

      })
      .catch(err => {
        console.log(err);
      })

    this.afService.getList('FeedbackOfItemFromUsers/' + this.key).subscribe(list => {
      console.log(list);
    })
  }

  getNumberLoveOfItemFromUsers() {
    this.dbService.getLengthOfDB('FavoriteOfItemFromUsers/' + this.key)
      .then((res: number) => {
        this.NUM_OF_LOVE = res;
      })
  }

  getNumberFeedbackOfItemFromUsers() {
    this.dbService.getLengthOfDB('FeedbackOfItemFromUsers/' + this.key)
      .then((res: number) => {
        this.NUM_OF_COMMENTS = res;
      })
  }

  // // 1. add to Favorite of User for Many Items
  // // 2. add to Fovorite of Item from many Users
  // onAddFovarite1() {
  //   if (this.afAuth.auth) {
  //     // 1. update FavoriteOfUserForItems
  //     let favorite1 = {
  //       item: this.key,
  //       date: this.appService.getCurrentDataAndTime()
  //     }
  //     this.dbService.insertOneNewItemReturnPromise(favorite1, 'FavoriteOfUserForItems/' + this.afAuth.auth.currentUser.uid)
  //       .then((data) => {
  //         console.log('Your favorite just added', data);
  //         this.appService.toastMsg('Your favorite just added', 3000);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         this.appService.alertError('Error', 'err');
  //       })

  //     // 2. update FavoriteOfItemFromUsers
  //     let favorite2 = {
  //       user: this.afAuth.auth.currentUser.uid,
  //       date: this.appService.getCurrentDataAndTime()
  //     };

  //     this.dbService.insertOneNewItemReturnPromise(favorite2, 'FavoriteOfItemFromUsers/' + this.key)
  //       .then((data) => {
  //         console.log('user just add to item favorites', data);
  //       })
  //       .catch(err => {
  //         console.log('Error', err);
  //       })
  //   } else {
  //     this.appService.alertMsg('Not signed', 'Please sign in to add favorite');
  //   }
  // }

  onAddFavorite() {
    console.log('onAddFavorite')

    if (this.afAuth.auth.currentUser) {
      let fav: iFavorite = {
        userID: this.afAuth.auth.currentUser.uid,
        itemID: this.key,
        date: this.appService.getCurrentDataAndTime()
      }
      this.appService.addFavorite(this.afAuth.auth.currentUser.uid, this.key, fav)
      this.appService.toastMsg('Your favorite just added', 3000);
    } else {
      this.appService.alertMsg('Not signed', 'Please sign in to add favorite');
    }
  }



  onFeedBack() {
    this.navCtrl.push('FeedbackPage', this.key);
  }

  viewFeedbackInDetail(feedback: iFeedback) {
    this.navCtrl.push('FeedbackDetailPage', feedback);
  }

  showInMap(soldItem) {
    this.navCtrl.push('ShowItemInMapPage', { key: this.key, data: this.obj })
  }

  makeCall(number) {
    console.log(number);
    this.callNumber.callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }



}

/*
input: { key: string, data: iSoldItem }
Call Number:
$ ionic cordova plugin add call-number
$ npm install --save @ionic-native/call-number
*/
