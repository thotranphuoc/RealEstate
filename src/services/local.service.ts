import { Injectable } from '@angular/core';
// import { AlertController, ToastController } from 'ionic-angular';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireService } from './af.service';
import { DbService } from './db.service';

import { iProfile } from '../interfaces/profile.interface';

@Injectable()

export class LocalService {
    itemAction: string = 'add-new';  // add-new, item-update
    existingImageUrls: string[] = [];
    orgExistingImageUrls: string[] = [];
    resizedImages: string[] = [];
    images: any[] = [];
    isUserChosenPositionSet: boolean = false;
    existingSoldItemID: string = null;

    NO_AVATAR: string = 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Favatar.png?alt=media&token=27b34944-943d-49f8-a204-419980813db4';
    USER_AVATAR: string = null;
    isProfileLoaded: boolean = false;
    
    constructor(
        private afService: AngularFireService,
        private dbService: DbService
    ) { }

    getImages() {
        return this.images;
    }
    setImages(images) {
        this.images = images;
    }

    getExistingSoldItemID() {
        return this.existingSoldItemID;
    }
    setExistingSoldItemID(id: string) {
        this.existingSoldItemID = id;
    }


    setItemAction(action: string) {
        this.itemAction = action
    }
    getItemAction() {
        return this.itemAction;
    }
    // For Add-item-new/ CAMERA
    setExistingImageUrls(imageUrls: string[]) {
        this.existingImageUrls = imageUrls;
    }
    getExistingImageUrls() {
        return this.existingImageUrls
    }

    setOrgExistingImageUrls(imageUrls: string[]) {
        this.orgExistingImageUrls = imageUrls;
        console.log(this.orgExistingImageUrls);
    }
    getOrgExistingImageUrls() {
        return this.orgExistingImageUrls
    }

    setResizedImages(resizedImages) {
        this.resizedImages = resizedImages;
    }
    getResizedImages() {
        return this.resizedImages;
    }

    // For Add-item-new // LOCATION
    setIsUserChosenPositionSet(isSet: boolean) {
        this.isUserChosenPositionSet = isSet
    }
    getIsUserChosenPositionSet() {
        return this.isUserChosenPositionSet;
    }

    getUserAvatar() {
        return this.USER_AVATAR;
    }

    setUserAvatar(avatar) {
        this.USER_AVATAR = avatar;
    }

    initUserInfo() {
        return new Promise((resolve, reject) => {
            let profile: iProfile = null;
            if (this.afService.getAuth().auth.currentUser != null) {
                // getProfile
                let uid = this.afService.getAuth().auth.currentUser.uid;
                this.dbService.getOneItemReturnPromise('UsersProfile/' + uid)
                    .then((res) => {
                        // console.log(res.val());
                        profile = res.val();
                        // console.log(profile);
                        resolve(profile);
                    })
            } else {
                console.log('user not login');
                reject(null);
            }
        })
    }
}

export interface iPhoto {
    url: string,
    VISIBLE: boolean,
    NEW: boolean
}

/*
this service is used to hold local variables between pages
 */