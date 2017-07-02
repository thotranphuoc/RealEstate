import { Injectable } from '@angular/core';
// import { AlertController, ToastController } from 'ionic-angular';
// import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()

export class LocalService {
    itemAction: string = 'add-new';  // add-new, item-update
    existingImageUrls: string[] = [];
    orgExistingImageUrls: string[] = [];
    resizedImages: string[] = [];
    images: any[] = [];
    isUserChosenPositionSet: boolean =  false;
    existingSoldItemID: string = null;
    constructor() { }

    getImages(){
        return this.images;
    }
    setImages(images){
        this.images = images;
    }

    getExistingSoldItemID(){
        return this.existingSoldItemID;
    }
    setExistingSoldItemID(id: string){
        this.existingSoldItemID = id;
    }
    

    setItemAction(action: string){
        this.itemAction = action
    }
    getItemAction(){
        return this.itemAction;
    }
    // For Add-item-new/ CAMERA
    setExistingImageUrls(imageUrls: string[]){
        this.existingImageUrls = imageUrls;
    }
    getExistingImageUrls(){
        return this.existingImageUrls
    }

    setOrgExistingImageUrls(imageUrls: string[]){
        this.orgExistingImageUrls = imageUrls;
        console.log(this.orgExistingImageUrls);
    }
    getOrgExistingImageUrls(){
        return this.orgExistingImageUrls
    }

    setResizedImages(resizedImages){
        this.resizedImages = resizedImages;
    }
    getResizedImages(){
        return this.resizedImages;
    }

    // For Add-item-new // LOCATION
    setIsUserChosenPositionSet(isSet: boolean){
        this.isUserChosenPositionSet = isSet
    }
    getIsUserChosenPositionSet(){
        return this.isUserChosenPositionSet;
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