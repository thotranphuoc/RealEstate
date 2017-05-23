import { Injectable } from '@angular/core';
// import { AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraService {
    constructor(
        // private alertCtrl: AlertController,
        // private toastCtrl: ToastController,
        private camera: Camera) { }

    takeBase64PictureFromCamera(): Promise<any> {
        // var base64Image: string = null;
        let options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 500,
            quality: 100,
            allowEdit: true,
            correctOrientation: false,
            saveToPhotoAlbum: true,
            // mediaType: 0
        };
        return this.camera.getPicture(options);

    }

    takeBase64PictureFromGallery(): Promise<any> {
        let options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 500,
            quality: 100,
            allowEdit: true,
            correctOrientation: false,
            saveToPhotoAlbum: true,
            mediaType: 0,
            sourceType: 0  // default camera =1, galery = 0
        }
        return this.camera.getPicture(options)
    }


}

/*
$ ionic cordova plugin add cordova-plugin-camera
$ npm install --save @ionic-native/camera
 */