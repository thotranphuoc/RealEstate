import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';
import { CameraService } from '../../services/camera.service';

import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile: iProfile = {
    AVATAR_URL: '',
    NAME: '',
    EMAIL: '',
    BIRTHDAY: '',
    TEL: '',
    ADDRESS: ''
    // FAVORITES: ['']
  }
  base64Image: string = null;
  hasNewAvatar: boolean = false;
  btnEnable: boolean = true;
  action :string =  'profile-owner';
  UID_toUpdated: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private dbService: DbService,
    private cameraService: CameraService,
    private afService: AngularFireService) {
      let Act = this.navParams.get('action');
      if(typeof(Act) !='undefined'){
        this.action = Act ;
        
      }
      
      if(this.action==='profile-owner'){
        this.getProfile();
        this.UID_toUpdated = this.afService.getAuth().auth.currentUser.uid;
        console.log(this.action, this.UID_toUpdated);
      }else{
        this.profile = this.navParams.get('data');
        this.UID_toUpdated = this.navParams.get('uid');
        console.log(this.action, this.UID_toUpdated);
      }

      
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  // onUpdateProfile1(form) {
  //   console.log('update start');
  //   this.btnEnable = false;
  //   // 1. upload image to storage, return url. setTo profile.AVATAR_URL
  //   this.dbService.uploadBase64Image2FirebaseReturnPromise('Avatar/' + this.afService.getAuth().auth.currentUser.uid, this.base64Image)
  //     .then((res) => {
  //       this.profile.AVATAR_URL = res.downloadURL;
  //       console.log(this.profile);
  //       // 2. insert or update profile database;
  //       this.dbService.insertOneNewItemWithSetReturnPromise(this.profile, 'UsersProfile/' + this.afService.getAuth().auth.currentUser.uid).then((res) => {
  //         console.log(res);
  //         console.log('insert successfully...');
  //         this.btnEnable = true;
  //       }).catch(err => {
  //         console.log(err);
  //         this.btnEnable = true;
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.btnEnable = true;
  //     })
  //   // // console.log(form.value);
  //   // console.log(this.profile);
  // }

  onUpdateProfile() {
    this.btnEnable = false;
    console.log('update start');
    // update current edited profile without avarta
    this.dbService.insertOneNewItemWithSetReturnPromise(this.profile, 'UsersProfile/' + this.UID_toUpdated)
      .then((res) => {
        console.log(res);
        console.log('insert successfully...');
        this.btnEnable = true;
      })
      .catch((err)=>{
        console.log(err);
      })
      .then(()=>{
        this.navCtrl.pop();
      })
    
    // update avatar if changed
    if(this.hasNewAvatar){
      this.dbService.uploadBase64Image2FirebaseReturnPromise('Avatar/'+this.UID_toUpdated, this.base64Image)
      .then((res)=>{
        console.log(res, res.downloadURL);
        this.afService.updateObjectData('UsersProfile/' + this.UID_toUpdated,{AVATAR_URL: res.downloadURL})
        .then((res)=>{
          console.log('update avatar succeeded');
        })
      })
    }

  }

  getProfile() {
    this.dbService.getOneItemReturnPromise('UsersProfile/' + this.afService.getAuth().auth.currentUser.uid)
      .then((data) => {
        console.log(data.val());
        let item = data.val();
        this.profile = {
          AVATAR_URL: item.AVATAR_URL,
          NAME: item.NAME,
          EMAIL: item.EMAIL,
          BIRTHDAY: item.BIRTHDAY,
          TEL: item.TEL,
          ADDRESS: item.ADDRESS,
          // FAVORITES: item.FAVORITES
        };

      })
      .catch(err => {
        console.log(err);
      })
  }

  takeAvatarPic() {
    this.presentActionSheet();
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



}
