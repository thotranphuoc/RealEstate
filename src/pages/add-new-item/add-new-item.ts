import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iPosition } from '../../interfaces/position.interface';
import { iProfile } from '../../interfaces/profile.interface';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { GmapService } from '../../services/gmap.service';
import { CameraService } from '../../services/camera.service';
import { AngularFireService } from '../../services/af.service';

declare var google;

@IonicPage()
@Component({
  selector: 'page-add-new-item',
  templateUrl: 'add-new-item.html',
})
export class AddNewItemPage {
  tabChoice: string = 'info';
  isCordova: boolean = false;
  soldItem: iSoldItem;
  profile: iProfile;
  loading: any;

  // INFO tab
  convertedPrice: string;

  // BROWSER CAMERA
  selectedFiles: FileList;
  imageDatas: any[] = [];
  resizedImageDatas: any[] = [];
  resultMsg: string;
  isUploadBtnEnabled: boolean = false;
  numberOfImages: number = 0;

  // LOCATION tab
  mapNewItem: any;
  userMarker: any;
  mapElement: any;

  // REVIEW & POST
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private dbService: DbService,
    private appService: AppService,
    private gmapService: GmapService,
    private cameraService: CameraService,
    private afService: AngularFireService,
    private geolocation: Geolocation,
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.soldItem = this.dbService.getSoldItem();
    
  }

  ionViewWillEnter(){
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewItemPage');
    if (this.afService.getAuth().auth.currentUser) {
      this.afService.getObject('UsersProfile/' + this.afService.getAuth().auth.currentUser.uid).subscribe((profile) => {
        this.profile = profile;
        console.log(this.profile);
        // console.log(profile.$key);
        this.updateUserInfo2SoldItem()

      })
    }
  }

  //=== INFO =====
  selectInfo() {
    // this.tabChoice = 'info';
    setTimeout(()=>{
      document.getElementById("name").setAttribute('tabIndex', '-1');
    },1000);
    
  }

  selectPhoto() {
    // this.tabChoice = 'info';
    // window.location.hash = '#focusCamera';
    // document.getElementById("camera").focus()
  }

  //=== LOCATION========
  selectLocation() {
    // this.tabChoice = 'location';
    console.log('selectLocation');
    setTimeout(() => {
      this.mapElement = document.getElementById('mapNewItem');
      this.initMap(this.mapElement);
    }, 1000)
  }

  initMap(mapElement) {
    if (this.dbService.isUserChosenPositionSet) {
      console.log('user location set');
      console.log(this.soldItem.POSITION)
      this.showMap(this.soldItem.POSITION, mapElement);
    } else {
      console.log('user location not set yet');
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let pos: iPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.showMap(pos, mapElement);
          this.soldItem.POSITION = pos;
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
        this.mapNewItem = map;
        this.gmapService.addMarkerToMap(this.mapNewItem, position).then((marker) => {
          this.userMarker = marker;
        })
        google.maps.event.addListener(this.mapNewItem, 'click', (event) => {
          this.userMarker.setMap(null);
          let position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(position);
          this.userMarker = new google.maps.Marker({
            position: position,
            map: this.mapNewItem
          })
          this.setUserChoosenPosition(position);
        })
      });
  }

  setUserChoosenPosition(position: iPosition) {
    this.soldItem.POSITION = position;
    this.dbService.isUserChosenPositionSet = true;
  }

  //==== REVIEW and POST ========
  selectReview() {
    // this.reviewImages = [];
    // this.tabChoice = 'review';
    console.log('selectReview');

    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
    // this.images.forEach(image => {
    //   if (image.isVisible) {
    //     this.reviewImages.push(image)
    //   }
    // })
    setTimeout(() => {
      this.mapElement = document.getElementById('mapreview');
      this.initMap(this.mapElement);
    }, 1000)
  }

  // === FOR BROWSER CAMERA
  detectFiles(event) {
    let reader = new FileReader();
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
    console.log('number of files: ', event.target.files.length);

    for (var index = 0; index < event.target.files.length + 1; index++) {
      if (index < event.target.files.length) {
        this.dbService.convertFile2ImageData(this.selectedFiles[index])
          .then(imgDataURL => {
            // console.log(imgDataURL);
            this.imageDatas.push(imgDataURL);
          })

        // convert files to HTMLImageElement in order to resize
        this.dbService.convertFile2ImageElement(this.selectedFiles[index])
          .then((el: HTMLImageElement) => {
            console.log(el);
            this.dbService.resizeImageFromImageElement(el, 750, 750, (resizedImg, before, after) => {
              this.resizedImageDatas.push(resizedImg);
              this.numberOfImages++;
              // console.log('Before:', before, 'After: ', after)
              // this.resultMsg = 'Before:' + before.toString() + '  After: ' + after.toString();
            })
          })
      }
    }
  }

  removeImage(image_Index) {
    this.imageDatas.splice(image_Index, 1);
    this.resizedImageDatas.splice(image_Index, 1);
    this.numberOfImages = this.resizedImageDatas.length;
  }

  uploadSingle() {
    let name = new Date().getTime().toString();
    this.dbService.uploadBase64Image2FBReturnPromiseWithURL('uploads/', this.resizedImageDatas[0], name);
  }

  uploadMultiple() {
    let name = new Date().getTime().toString();
    this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('uploads', this.resizedImageDatas, name)
      .then(res => {
        console.log(res);
      })

  }

  uploadResizedImage(imageData: string) {
    let name = new Date().getTime().toString();
    let url = 'uploads/' + name;
    this.dbService.uploadBase64Image2FirebaseReturnPromise(url, imageData)
      .then((dlURL) => {
        console.log(dlURL.downloadURL);
      })
  }

  uploadResizedImages(images: string[]) {
    images.forEach(image => {
      this.uploadResizedImage(image);
    });
  }

  onKeyUp() {
    console.log(this.soldItem.PRICE);
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
  }

  // POST ITEM
  postItem() {
    
    this.hasPosted = true;
    var itemKey: string = '';
    console.log(this.soldItem);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      if(this.afService.getAuth().auth.currentUser){
        this.startLoading()
        this.soldItem.UID = this.afService.getAuth().auth.currentUser.uid;
        this.soldItem.POSTDATE = this.appService.getCurrentDataAndTime();
        this.updateUserInfo2SoldItem(); // make sure info update
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
                  this.navCtrl.setRoot('MapPage')
                })
                .catch((err) => { 
                  console.log(err);
                  this.appService.alertError('Error', err.toString())
                })
            })
            .catch((err) => { 
              this.hideLoadingWithMessage('Your item will be posted as soon as network available');
              console.log(err); 
              this.appService.alertError('Error', err)
            })
        })
      }else{
        // not logged in
        this.alertMsgWithConfirmationToGoToPage();
      }
    }else {
      console.log('missed');
      this.alertMsgConfirmation('Missing:', 'Please fill all required info');
    }
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
              this.tabChoice = 'info';
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

  resetSoldItem() {
    let default_soldItem: iSoldItem = {
      UID: null,
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

  updateUserInfo2SoldItem(){
    this.soldItem.NAME = this.profile.NAME;
        this.soldItem.PHONE = this.profile.TEL;
        this.dbService.setSoldITem(this.soldItem);
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

  private hideLoadingWithMessage(message: string){
    this.loading.dismiss();
    this.appService.alertMsg('Alert', message);
    this.navCtrl.setRoot('MapPage');
  }



}
