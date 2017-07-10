import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';
import { CameraService } from '../../services/camera.service';
import { AppService } from '../../services/app.service';

import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  isCordova: boolean = false;
  currentUser: any;
  profile: iProfile = {
    AVATAR_URL: 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Favatar.png?alt=media&token=27b34944-943d-49f8-a204-419980813db4',
    NAME: '',
    EMAIL: '',
    BIRTHDAY: '',
    TEL: '',
    ADDRESS: '',
    STATE: 'ACTIVE',
    VERIFIED: false
    // FAVORITES: ['']
  }
  base64Image: string = null;
  hasNewAvatar: boolean = false;
  btnEnable: boolean = true;
  action: string = 'profile-owner';
  UID_toUpdated: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private dbService: DbService,
    private cameraService: CameraService,
    private afService: AngularFireService,
    private appService: AppService ) {
    this.isCordova = this.platform.is('cordova') ? true : false;
    let Act = this.navParams.get('action');
    if (typeof (Act) != 'undefined') {
      this.action = Act;
    }

    // user update profile by himself
    if (this.action === 'profile-owner') {
      this.currentUser = this.afService.getAuth().auth.currentUser;
      this.getProfile();
      this.UID_toUpdated = this.currentUser.uid;
      this.profile.EMAIL = this.currentUser.email;
      console.log(this.action, this.UID_toUpdated, this.profile);
    } else {
      // admin update profile for user
      this.profile = this.navParams.get('data');
      this.UID_toUpdated = this.navParams.get('uid');
      console.log(this.action, this.UID_toUpdated);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  onUpdateProfile() {
    this.btnEnable = false;
    console.log('update start');
    // update current edited profile without avarta
    this.dbService.insertOneNewItemWithSetReturnPromise(this.profile, 'UsersProfile/' + this.UID_toUpdated)
      .then((res) => {
        console.log(res);
        console.log('insert successfully...');
        this.btnEnable = this.hasNewAvatar? false: true;
      }, err => console.log(err))

    // .then(() => {
    //   this.navCtrl.pop();
    // })

    // update avatar if changed
    if (this.hasNewAvatar) {
      console.log('start update profile avatar', this.base64Image);
      let name = new Date().getTime().toString();
      this.dbService.uploadBase64Image2FBReturnPromiseWithURL('Avatar/', this.base64Image, this.UID_toUpdated)
        .then((res: string) => {
          console.log(res, res);
          this.afService.updateObjectData('UsersProfile/' + this.UID_toUpdated, { AVATAR_URL: res })
            .then(() => {
              
              console.log('update avatar succeeded');
              this.appService.toastMsg('Your profile updated successfully', 3000)
              this.btnEnable = true;
            }, err => console.log(err))
        })
        .catch(err => console.log(err));
    }

  }

  getProfile() {
    this.dbService.getOneItemReturnPromise('UsersProfile/' + this.currentUser.uid)
      .then((data) => {
        console.log(data.val());
        let item = data.val();
        if (item) {
          this.profile = {
            AVATAR_URL: item.AVATAR_URL,
            NAME: item.NAME,
            EMAIL: item.EMAIL,
            BIRTHDAY: item.BIRTHDAY,
            TEL: item.TEL,
            ADDRESS: item.ADDRESS,
            STATE: item.STATE,
            VERIFIED: item.VERIFIED
            // FAVORITES: item.FAVORITES
          };
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  takeAvatarPic() {
    if (this.isCordova) {
      this.presentActionSheet();
    } else {
      this.selectPhotoByBrowser()
    }
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
        this.hasNewAvatar = true;
        // sync with dbService
        // this.dbService.addUserCapturedBase64Image(this.base64Image);
        // this.base64Images = this.dbService.getUserCapturedBase64Images();

      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

  takeBase64PictureFromGallery() {
    this.cameraService.takeBase64PictureFromGallery()
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.hasNewAvatar = true;
        // sync with dbService
        // this.dbService.addUserCapturedBase64Image(this.base64Image);
        // this.base64Images = this.dbService.getUserCapturedBase64Images();
      }, err => {
        alert(err);
      })
      .catch(err => alert(err))
  }

  takePictureAndResizeByBrowser(event) {
    this.dbService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrl: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrl);
          this.base64Image = imgDataUrl[0];
          this.hasNewAvatar = true;
          console.log(this.hasNewAvatar);
        }, 1000);
      })
  }

  selectPhotoByBrowser() {
    console.log('select photo')
    document.getElementById('inputFilea').click();
  }



}

/*
  input:
  action == 'profile-owner' -> user update his profile by himself
  action !== 'profile-owner' -> admin update;
  
*/
