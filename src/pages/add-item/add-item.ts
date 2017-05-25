import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iPosition } from '../../interfaces/position.interface';

import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { GmapService } from '../../services/gmap.service';
import { CameraService } from '../../services/camera.service';
import { AngularFireService } from '../../services/af.service';

declare var google;

@IonicPage()
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  action: string = 'add-new';
  tabChoice: any;
  soldItem: iSoldItem;

  // INFO tab
  convertedPrice: string;

  // PHOTO CAMERA

  base64Images: string[];
  base64Image: string;
  // LOCATION tab
  mapNewItem: any;
  userMarker: any;
  mapElement: any;

  // REVIEW & POST
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;


  // for update item
  itemID: string;
  isUpdated: boolean = false;
  images: iImage[] = [];
  showedImage: iImage = null;
  selectedIndex: number = 0;
  reviewImages: iImage[] = [];
  // @ViewChild('mapNewItem') mapElement1: ElementRef;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private dbService: DbService,
    private appService: AppService,
    private gmapService: GmapService,
    private cameraService: CameraService,
    private afService: AngularFireService,
    private geolocation: Geolocation, ) {
    // action: add-new or update-item
    let Act = this.navParams.get('action');
    if (typeof (Act) != 'undefined') {
      this.action = Act;
    }
    console.log(this.action);

    // if action is update -> existing
    if (this.action == 'update-item') {
      this.images = [];
      this.isUpdated = true;
      this.itemID = this.navParams.get('soldItem_ID');
      this.afService.getObject('soldItems/' + this.itemID)
        .subscribe((item) => {
          console.log(item);
          this.soldItem = item;
          // this.dbService.base64Images = this.soldItem.PHOTOS;
          // this.base64Images = this.soldItem.PHOTOS;
          this.dbService.isUserChosenPositionSet = true;
          if (typeof (this.soldItem.PHOTOS) != 'undefined') {
            this.soldItem.PHOTOS.forEach(photo => {
              this.images.push({ imageURL: photo, isVisible: true, toBeDeleted: false, isNewCapturedImage: false });
            })
          }
          if (this.images.length > 0) {
            this.showedImage = this.images[0];
          }
          console.log(this.images);
        })
        .unsubscribe();
    } else {
      this.soldItem = this.dbService.getSoldItem();
    }
    this.tabChoice = 'info';

    if (this.afService.getAuth().auth.currentUser) {
      this.afService.getObject('UsersProfile/' + this.afService.getAuth().auth.currentUser.uid).subscribe((profile) => {
        console.log(profile);
        console.log(profile.$key);
        this.soldItem.NAME = profile.NAME;
        this.soldItem.PHONE = profile.TEL;
        this.soldItem.AVATAR_URL = profile.AVATAR_URL;
        this.dbService.setSoldITem(this.soldItem);

      })
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemPage');
  }
  //=== INFO =====
  selectInfo() {
    // this.tabChoice = 'info';
  }

  onKeyUp() {
    console.log(this.soldItem.PRICE);
    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
  }


  // ====PHOTO CAMERA======
  selectPhoto() {
    // this.tabChoice = 'photo';

    // this.base64Images = this.dbService.getUserCapturedBase64Images();
    // if (this.base64Images.length > 0) {
    //   this.base64Image = this.base64Images[this.base64Images.length - 1];
    // }
  }

  onSelectImage(i: number) {
    if (this.images[i]) {
      if (this.images[i].isVisible) {
        console.log(this.images[i].isNewCapturedImage, this.images[i].imageURL)
        this.showedImage = this.images[i];
        this.selectedIndex = i;
      }
    }
  }

  // onSelectImage(image: iImage) {
  //   console.log(image.isNewCapturedImage, image.imageData)
  //   this.showedImage = image;
  // }

  click2DeleteImage(image: iImage) {
    console.log(this.selectedIndex);
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete Image',
          handler: () => {
            // this.deleteImage(image);
            image.toBeDeleted = true;
            image.isVisible = false;
            this.images[this.selectedIndex].toBeDeleted = true;
            this.images[this.selectedIndex].isVisible = false;

            // sort array images, so that only the visible image canbe shown properly
            this.images.sort((a, b) => {
              let ax = a.isVisible ? 1 : 0;
              let bx = b.isVisible ? 1 : 0;
              return bx - ax;
            })
            this.showedImage = this.images[0];
            console.log(this.images);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  deleteImage(image: iImage) {
    console.log(image);
    this.appService.deleteItemImageFromStorage(image.imageURL)
    this.images.splice(this.selectedIndex, 1);

    // this.dbService.deleteFileFromFireStorageWithHttpsURL(images[this.index2Remove].)
    // this.appService.deleteItem(this.afService.getAuth().auth.currentUser.uid, this.itemID);
  }

  presentActionSheet() {
    // this.loadImage();
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            // this.takePicture(Camera.PictureSourceType.CAMERA);
            this.takeBase64PicFromCamera();
          }
        },
        {
          text: 'Load from library',
          handler: () => {
            this.takeBase64PictureFromGallery();
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

  takeBase64PicFromCamera() {
    this.cameraService.takeBase64PictureFromCamera()
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        // sync with dbService
        this.dbService.addUserCapturedBase64Image(this.base64Image);
        this.base64Images = this.dbService.getUserCapturedBase64Images();
        let image: iImage = {
          isNewCapturedImage: true,
          toBeDeleted: false,
          isVisible: true,
          imageURL: this.base64Image
        }
        this.showedImage = image;
        this.images.push(image);

      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

  takeBase64PictureFromGallery() {
    this.cameraService.takeBase64PictureFromGallery()
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        // sync with dbService
        this.dbService.addUserCapturedBase64Image(this.base64Image);
        this.base64Images = this.dbService.getUserCapturedBase64Images();
        let image: iImage = {
          isNewCapturedImage: true,
          toBeDeleted: false,
          isVisible: true,
          imageURL: this.base64Image
        }
        this.images.push(image);
        this.showedImage = image;
      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
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
    this.reviewImages =[];
    // this.tabChoice = 'review';
    console.log('selectReview');

    if (this.soldItem.PRICE) {
      this.convertedPrice = this.appService.convertToCurrency(this.soldItem.PRICE.toString(), ',');
    }
    this.images.forEach(image=>{
      if(image.isVisible){
        this.reviewImages.push(image)
      }
    })
    setTimeout(() => {
      this.mapElement = document.getElementById('mapreview');
      this.initMap(this.mapElement);
    }, 1000)
  }

  postItem() {
    var itemKey: string = '';
    console.log(this.soldItem);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {

      if (this.afService.getAuth().auth.currentUser) {
        this.hasPosted = true;
        this.soldItem.UID = this.afService.getAuth().auth.currentUser.uid;
        this.soldItem.POSTDATE = this.appService.getCurrentDataAndTime();
        if (this.isUpdated) {
          // update for existing item:
          this.afService.setObjectData('soldItems/' + this.itemID, this.soldItem)
            .then(() => {
              // upload newImages to folder /images/soldItem_key/ if there are images 
              let newImages = [];
              let oldImages = [];
              let deleteOldImages: iImage[] = [];
              this.images.forEach(image => {
                if (image.isNewCapturedImage && image.isVisible) {
                  newImages.push(image.imageURL);
                } else if (!image.isNewCapturedImage && !image.isVisible) {
                  deleteOldImages.push(image);
                } else if (!image.isNewCapturedImage && image.isVisible) {
                  oldImages.push(image.imageURL);
                } else {
                  // new but not invisible : capture but cancel afterward
                  // do nothing
                }

                deleteOldImages.forEach(image => {
                  this.deleteImage(image);
                })
              })


              console.log('newImages length: ', newImages.length, newImages);
              console.log('oldImages length: ', oldImages.length, oldImages);
              // this.uploadImages2FbStorage(newImages, this.itemID)
              this.uploadImagesReturnArrayOfURL(newImages, this.itemID)
                .then((url) => {
                  console.log(url);
                  let finalImageURLs = url.concat(oldImages)
                  console.log(finalImageURLs);
                  // update final item.PHOTOS url
                  this.afService.updateObjectData('soldItems/' + this.itemID, { PHOTOS: finalImageURLs })
                    .then(() => {
                      this.resetSoldItem();
                      this.navCtrl.pop();
                    })
                    .catch((err) => { console.log(err); })
                })
                .catch((err) => { console.log(err); })
            })
            .catch((err) => { console.log(err); })
        } else {
          // create new
          this.appService.postSoldItemReturnPromiseWithKey(this.soldItem, 'soldItems')
            .then((key: string) => {
              console.log(key);
              let soldItem_Key = key

              // update UserSoldItems table
              this.updateUserSoldItem(this.afService.getAuth().auth.currentUser.uid, soldItem_Key);

              // upload image to folder /images/soldItem_key/ if there are images 
              let newImages = [];
              let oldImages = [];
              let deleteOldImages = [];
              this.images.forEach(image => {
                if (image.isNewCapturedImage && image.isVisible) {
                  newImages.push(image.imageURL);
                } else if (!image.isNewCapturedImage && !image.isVisible) {
                  deleteOldImages.push(image);
                } else if (!image.isNewCapturedImage && image.isVisible) {
                  oldImages.push(image.imageURL);
                } else {
                  // new but not invisible : capture but cancel afterward
                  // do nothing
                }
              })
              console.log('newImages length: ', newImages.length);
              this.uploadImagesReturnArrayOfURL(newImages, soldItem_Key)
                .then((url) => {
                  console.log(url);
                  this.afService.updateObjectData('soldItems/' + soldItem_Key, { PHOTOS: url })
                    .then(() => {
                      this.resetSoldItem();
                      this.navCtrl.pop();
                    })
                    .catch((err) => { console.log(err); })
                })
                .catch((err) => { console.log(err); })

              deleteOldImages.forEach(image => {
                this.deleteImage(image);
              })
            })
            .catch((err) => { console.log(err); })

        }

      } else {
        // not logged in
        this.alertMsgWithConfirmationToGoToPage();
      }
    } else {
      console.log('missed');
      this.alertMsgConfirmation('Missing:', 'Please fill all required info');
    }

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



  uploadImages2FbStorage2(images: any[], itemID) {
    this.dbService.uploadBase64Images2FirebaseReturnPromise(this.base64Images, 'images/' + itemID)
      .then((data) => {
        let downloadURLs = data;
        // // FOR: to avoid error when SoldItem not have image. Add logo as one pic default
        // if (downloadURLs.length < 1) {
        //   console.log('downloadUrls.length = 0');
        //   downloadURLs = ['https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.png?alt=media&token=c1d12642-a7f8-4d7a-94e2-f37b4da66b76']
        // }
        // update soldItem.PHOTOS

        this.afService.getList('soldItems/' + itemID + '/PHOTOS')
          .subscribe((photos) => {
            console.log(photos);
            photos.forEach(photo => {
              console.log(photo.$value);
              this.images.push(photo.$value)
            })
            // let images: string[] = photos;
            downloadURLs.forEach(dlURL => {
              images.push(dlURL);
            })
            console.log(this.images);
            console.log(itemID);
            this.afService.updateObjectData('soldItems/' + itemID, { PHOTOS: this.images })
              .then(() => {
                console.log('upload and update PHOTOS succeed');
                this.appService.alertMsg('Done', 'Successfully. Your post will be approved shortly');
                this.resetSoldItem();
                console.log(this.soldItem);
                this.navCtrl.push('MapPage');
              })
              .catch((err) => { console.log(err); })
          })
          .unsubscribe()

      })
      .catch((err) => { console.log(err); })
  }

  uploadImages2FbStorage1(images: any[], itemID) {
    var downloadURLs = [];
    // upload images to firebase, get baack array of url
    this.dbService.uploadBase64Images2FirebaseReturnPromise(images, 'images/' + itemID)
      .then((data: string[]) => {
        downloadURLs = data;
        console.log(downloadURLs);
      })
      // get current item.PHOTOS array
      .then(() => {
        this.dbService.getItemsFromFBReturnPromise('soldItems/' + itemID + '/PHOTOS')
          .then(snapshot => {
            snapshot.forEach(snapChild => {
              console.log(snapChild.val());
              downloadURLs.push(snapChild.val());
              return false;
            });
          })
          .then(() => {
            // // FOR: to avoid error when SoldItem not have image. Add logo as one pic default
            if (downloadURLs.length < 1) {
              console.log('downloadUrls.length = 0');
              downloadURLs = ['https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.png?alt=media&token=c1d12642-a7f8-4d7a-94e2-f37b4da66b76']
            }
            // update soldItem.PHOTOS
            this.afService.updateObjectData('soldItems/' + itemID + '/PHOTOS', downloadURLs)
            console.log('photos update succeed')
          })
          .catch((err) => { console.log(err); })
      })
      .catch((err) => { console.log(err); })

  }

  uploadImagesReturnArrayOfURL(images: any[], itemID) {
    return this.dbService.uploadBase64Images2FirebaseReturnPromise(images, 'images/' + itemID)
  }

  uploadImages2FbStorage(images: any[], itemID) {
    var downloadURLs = [];
    // upload images to firebase, get baack array of url
    this.dbService.uploadBase64Images2FirebaseReturnPromise(images, 'images/' + itemID)
      .then((data: string[]) => {
        downloadURLs = data;
        console.log(downloadURLs);
      })
      // get current item.PHOTOS array
      .then(() => {
        this.dbService.getItemsFromFBReturnPromise('soldItems/' + itemID + '/PHOTOS')
          .then(snapshot => {
            snapshot.forEach(snapChild => {
              console.log(snapChild.val());
              downloadURLs.push(snapChild.val());
              return false;
            });
          })
          .then(() => {
            // // FOR: to avoid error when SoldItem not have image. Add logo as one pic default
            if (downloadURLs.length < 1) {
              console.log('downloadUrls.length = 0');
              downloadURLs = ['https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Flogo.png?alt=media&token=c1d12642-a7f8-4d7a-94e2-f37b4da66b76']
            }
            // update soldItem.PHOTOS
            this.afService.updateObjectData('soldItems/' + itemID + '/PHOTOS', downloadURLs)
            console.log('photos update succeed')
          })
          .catch((err) => { console.log(err); })
      })
      .catch((err) => { console.log(err); })

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



}

export interface iImage {
  isNewCapturedImage: boolean,
  toBeDeleted: boolean,
  isVisible: boolean,
  imageURL: string
}
