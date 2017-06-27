import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iPosition } from '../../interfaces/position.interface';
import { iProfile } from '../../interfaces/profile.interface';
import { DbService } from '../../services/db.service';
import { GmapService } from '../../services/gmap.service';
import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';

declare var google;
@IonicPage()
@Component({
  selector: 'page-add-item-new-tab4',
  templateUrl: 'add-item-new-tab4.html',
})
export class AddItemNewTab4Page {
  soldItem: iSoldItem;
  profile: iProfile;
  loading: any;

  resizedImageDatas;
  convertedPrice: string;
  mapreview: any;
  userMarker: any;
  mapElement: any;

  // REVIEW & POST
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private app: App,
    private dbService: DbService,
    private appService: AppService,
    private gmapService: GmapService,
    private afService: AngularFireService,
    private geolocation: Geolocation) {
    this.soldItem = this.dbService.getSoldItem();
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab4Page');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    this.soldItem = this.dbService.getSoldItem();
    this.resizedImageDatas = this.dbService.getResizedImageDatas();
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
    this.initPage();
  }

  initPage() {
    setTimeout(() => {
      this.mapElement = document.getElementById('mapreview');
      this.initMap(this.mapElement);
    }, 1000)
  }

  initMap(mapElement) {
    if (this.dbService.isUserChosenPositionSet) {
      console.log('user location set');
      console.log(this.dbService.soldItem.POSITION)
      this.showMap(this.dbService.soldItem.POSITION, mapElement);
    } else {
      console.log('user location not set yet');
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let pos: iPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.showMap(pos, mapElement);
          this.dbService.soldItem.POSITION = pos;
        })
    }
  }

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    console.log(mapElement, mapOptions);

    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.mapreview = map;
        this.gmapService.addMarkerToMap(this.mapreview, position).then((marker) => {
          this.userMarker = marker;
        })
        google.maps.event.addListener(this.mapreview, 'click', (event) => {
          this.userMarker.setMap(null);
          let position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(position);
          this.userMarker = new google.maps.Marker({
            position: position,
            map: this.mapreview
          })
          this.setUserChoosenPosition(position);
        })
      });
  }

  setUserChoosenPosition(position: iPosition) {
    this.dbService.soldItem.POSITION = position;
    // this.soldItem.POSITION = position;
    this.dbService.isUserChosenPositionSet = true;
  }

  // POST ITEM
  postItem() {

    this.hasPosted = true;
    var itemKey: string = '';
    console.log(this.soldItem);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      if (this.afService.getAuth().auth.currentUser) {
        this.startLoading()
        this.soldItem.UID = this.afService.getAuth().auth.currentUser.uid;
        this.soldItem.POSTDATE = this.appService.getCurrentDataAndTime();
        // this.updateUserInfo2SoldItem(); // make sure info update
        this.appService.postSoldItemReturnPromiseWithKey(this.soldItem, 'soldItems')
          .then((key: string) => {
            console.log('new item key', key);
            let soldItem_Key = key;

            // update UserSoldItems table;
            this.updateUserSoldItem(this.afService.getAuth().auth.currentUser.uid, soldItem_Key);

            // upload imageDatas to folder /images/soldItem_key/
            let name = new Date().getTime().toString();
            this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('images/' + soldItem_Key, this.resizedImageDatas, name)
              .then((urls) => {
                this.afService.updateObjectData('soldItems/' + soldItem_Key, { PHOTOS: urls })
                  .then(() => {
                    this.hideLoading();
                    this.resetSoldItem();
                    this.go2Page('MapPage');
                  })
                  .catch((err) => {
                    console.log(err);
                    this.appService.alertError('Error', err.toString())
                    this.hasPosted = false;
                  })
              })
              .catch((err) => {
                this.hideLoadingWithMessage('Your item will be posted as soon as network available');
                console.log(err);
                // this.appService.alertError('Error', err)
                this.hasPosted = false;
              })
          })
      } else {
        // not logged in
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToPage();
      }
    } else {
      console.log('missed');
      this.hasPosted = false;
      this.alertMsgConfirmation('Missing:', 'Please fill all required info');
    }
  }

  checkInfoFullFilled() {
    this.isInfoFullFilled = true;
    if (this.soldItem.NAME == null || this.soldItem.NAME == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.NAME, ' is missed');
    }
    if (this.soldItem.PHONE == null || this.soldItem.PHONE == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.PHONE, ' is missed');
    }
    if (this.soldItem.PRICE == null || this.soldItem.PRICE.toString() == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.PRICE, ' is missed');
    }
    if (this.soldItem.USEDSQUARES == null || this.soldItem.PRICE.toString() == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.USEDSQUARES, ' is missed');
    }
    if (this.soldItem.GROUNDSQUARES == null || this.soldItem.PRICE.toString() == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.GROUNDSQUARES, ' is missed');
    }
    if (this.soldItem.ADDRESS == null || this.soldItem.ADDRESS == '') {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.ADDRESS, ' is missed');
    }
    if (this.soldItem.FACILITIES.hasCENTER && this.soldItem.FACILITIES.hasCENTERFAR == null) {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.FACILITIES.hasCENTERFAR, ' hasCENTERFAR is missed');
    }
    if (this.soldItem.FACILITIES.hasSCHOOL && this.soldItem.FACILITIES.hasSCHOOLFAR == null) {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.FACILITIES.hasSCHOOLFAR, '  hasSCHOOLFAR is missed');
    }
    if (this.soldItem.FACILITIES.hasMART && this.soldItem.FACILITIES.hasMARTFAR == null) {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.FACILITIES.hasMARTFAR, ' hasMARTFAR is missed');
    }
    if (this.soldItem.FACILITIES.hasHOSPITAL && this.soldItem.FACILITIES.hasHOSPITALFAR == null) {
      this.isInfoFullFilled = false;
      console.log(this.soldItem.FACILITIES.hasHOSPITALFAR, ' hasHOSPITALFAR is missed');
    }
    console.log(this.soldItem.PRICE);
    console.log(this.soldItem.USEDSQUARES);
    console.log(this.soldItem.GROUNDSQUARES);
    console.log(this.soldItem.ADDRESS);

    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }

  // LOADING
  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 20000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  private hideLoadingWithMessage(message: string) {
    this.loading.dismiss();
    this.appService.alertMsg('Alert', message);
    this.go2Page('MapPage')
  }

  resetSoldItem() {
    let default_soldItem: iSoldItem = {
      UID: null,
      AVATAR_URL: null,
      NAME: null,
      PHONE: null,
      KIND: 'setHouse', // pho, chungcu, dat
      PRICE: null,
      GROUNDSQUARES: null,
      USEDSQUARES: null,
      FACILITIES: {
        hasSCHOOL: false,
        hasSCHOOLFAR: null,
        hasMART: false,
        hasMARTFAR: null,
        hasHOSPITAL: false,
        hasHOSPITALFAR: null,
        hasCENTER: false,
        hasCENTERFAR: null
      },
      ADDRESS: null,
      PHOTOS: [],
      POSITION: { lat: 0, lng: 0 },
      VISIBLE: true,
      POSTDATE: '2017/04/30'
    };

    this.dbService.setSoldITem(default_soldItem);
    this.soldItem = this.dbService.getSoldItem();
  }

  alertMsgConfirmation(title: string, msg: string) {
    this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            setTimeout(() => {
              this.navCtrl.parent.select(0);
            }, 500);
          }
        }
      ]
    }).present()
  }

  alertMsgWithConfirmationToGoToPage() {
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
            console.log('go to Account page to login ');
            // this.navCtrl.popToRoot();
            this.navCtrl.push('AccountPage', { action: 'sign-in' });
          }
        }
      ]
    }).present();
  }

  // updateUserInfo2SoldItem() {
  //   this.soldItem.NAME = this.profile.NAME;
  //   this.soldItem.PHONE = this.profile.TEL;
  //   this.soldItem.AVATAR_URL = this.profile.AVATAR_URL;
  //   this.dbService.setSoldITem(this.soldItem);
  // }

  updateUserSoldItem(userID, itemID) {
    let item = {
      key: itemID,
      date: this.appService.getCurrentDate()
    };
    this.dbService.insertOneNewItemWithSetReturnPromise(item, 'UserSoldItems/' + userID + '/' + itemID)
      .then((res) => {
        console.log(res, 'update successfully');
      })
      .catch(err => console.log(err))
  }

  go2Page(page: string){
    const root = this.app.getRootNav();
    root.setRoot(page);
  }



}
