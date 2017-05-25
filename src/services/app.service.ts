import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, NavController } from 'ionic-angular';

import { iSetting } from '../interfaces/setting.interface';
import { iSoldItem } from '../interfaces/sold-item.interface';

import { AngularFireService } from './af.service';
import { DbService } from './db.service';

@Injectable()
export class AppService {
    SETTINGS: iSetting = {
        setHouse: true,
        setApartment: true,
        setLand: true,
        setOther: true,
        language: 'English'
    }
    loadCtrl: any;

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private afService: AngularFireService,
        private dbService: DbService) { }

    alertError(title: string, msg: string) {
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['OK']
        }).present();
    }
    alertMsg(title: string, msg: string) {
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['OK']
        }).present();
    }

    toastMsg(msg: string, duration: number) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: duration
        });
        toast.present();
    }

    convertToCurrency(number: string, seperatedSymbol: string): string {
        let parts = [];
        let len = number.length / 3;
        // console.log(len);
        for (let i = 0; i < len; i++) {
            let fromNum = number.length - (3 + i * 3);
            if (fromNum > 0) {
                parts[i] = number.substr(fromNum, 3);
                // console.log(parts[i]);
            } else {
                parts[i] = number.substr(0, number.length - i * 3);
                // console.log(parts[i]);
            }
        }
        // console.log(parts);
        var convertN = '';
        var finalConvertedN = '';
        for (let i = 1; i <= parts.length; i++) {
            convertN = convertN.concat(parts[parts.length - i], seperatedSymbol);

        }
        finalConvertedN = convertN.substr(0, convertN.length - 1);
        // console.log(finalConvertedN);
        return finalConvertedN;
    }

    getSetting() {
        return this.SETTINGS;
    }

    updateSetting(settings: iSetting) {
        this.SETTINGS = settings;
    }

    startLoadingCtrl() {
        this.loadCtrl = this.loadingCtrl.create({
            duration: 3000
        }).present();
    }

    // return format: '2017/04/09'
    getCurrentDate(): string {
        let today = new Date();
        return today.getUTCFullYear().toString() + '/' + (today.getMonth() + 1).toString() + '/' + today.getDate().toString();
    }

    // return format: '12:30:15'
    getCurrentTime(): string {
        let today = new Date();
        return today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();
    }

    getCurrentDataAndTime(): string {
        return this.getCurrentDate() + ' ' + this.getCurrentTime();
    }

    // stopLoadingCtrl(){
    //     this.loadCtrl.dismiss();
    // }

    convertCodeToDetail(code: string): string {
        switch (code) {
            case 'setHouse':
                return 'Nhà riêng lẻ';
            case 'setApartment':
                return 'Chưng cư, CHCC';
            case 'setLand':
                return 'Đất vườn';
            case 'setOther':
                return 'Khác';
            default:
                return 'Khác';
        };
    }

    // alertMsgWithConfirmationToGoToPage(page) {
    //     return this.alertCtrl.create({
    //         title: 'Not Signed',
    //         message: 'Plz login to continue',
    //         buttons: [
    //             {
    //                 text: 'Cancel',
    //                 handler: () => {

    //                 }
    //             },
    //             {
    //                 text: 'OK',
    //                 handler: () => {
    //                     console.log('go to page: ', page);
    //                     // this.navCtrl.popToRoot();
    //                     this.navCtrl.push(page);
    //                 }
    //             }
    //         ]
    //     })
    // }

    getObjectInfoForPopover() {
        let infoObject = {
            position: { lat: 0, lng: 0 },
            imgUrl: 'http://tanthoidai.com.vn/images/gallery/images/D%E1%BB%B1%20%C3%A1n%20Vinhomes%20Riverside/biet-thu-Vinhomes-Riverside-ngoai-tha.jpg',
            price: '1 tỷ 500',
            dtSan: '100m2 sàn',
            dtSd: '300m2 sử dụng'
        }

        return infoObject;
    }

    addFavorite(uid: string, itemId: string, data: any) {
        // add to FavoriteOfUserForItems
        this.afService.setObjectData('FavoriteOfUserForItems/' + uid + '/' + itemId, data)
            .then(() => {
                console.log(uid, itemId, data, 'just added successfully');
            });
        // add to FavoriteOfItemFromUsers
        this.afService.setObjectData('FavoriteOfItemFromUsers/' + itemId + '/' + uid, data)
            .then(() => {
                console.log(uid, itemId, data, 'just added successfully');
            });
    }

    removeFavorite(uid: string, itemId: string){
        let data = null
        // remove from FavoriteOfUserForItems
        this.afService.setObjectData('FavoriteOfUserForItems/' + uid + '/' + itemId, data)
            .then(() => {
                console.log(uid, itemId, data, 'just removed successfully');
            });
        // remove FavoriteOfItemFromUsers
        this.afService.setObjectData('FavoriteOfItemFromUsers/' + itemId + '/' + uid, data)
            .then(() => {
                console.log(uid, itemId, data, 'just removed successfully');
            });
    }

    addFeedback(uid: string, itemId: string, data: any) {
        // add to FeedbackOfUserForItems
        this.afService.setObjectData('FeedbackOfUserForItems/' + uid + '/' + itemId, data)
            .then(() => {
                console.log(uid, itemId, data);
            });
        // add to FeedbackOfItemFromUsers
        this.afService.setObjectData('FeedbackOfItemFromUsers/' + itemId + '/' + uid, data)
            .then(() => {
                console.log(uid, itemId, data);
            });
    }

    postSoldItemReturnPromiseWithKey(soldItem: iSoldItem, URL: string) {
        return new Promise((resolve, reject) => {
            var itemKey;
            this.dbService.insertOneNewItemReturnPromise(soldItem, URL)
                .then((res) => {
                    itemKey = res.key;
                    resolve(itemKey);
                })
        })
    }

    // Delete item from firebase db
    deleteItemWithURL(userId, itemId){
        // delete from soldItems/itemId
        this.afService.deleteItemFromList('soldItems', itemId);
        // delete from UserSoldItems/UserID/itemId
        this.afService.deleteItemFromList('UserSoldItems/'+userId, itemId);
        // delete from FavoriteOfItemFromUsers/itemID
        this.afService.deleteItemFromList('FavoriteOfItemFromUsers', itemId);
        // delete from FeedbackOfItemFromUsers
        this.afService.deleteItemFromList('FeedbackOfItemFromUsers', itemId);
    }
    // Delete item from firebase storage
    deleteItemImageFromStorage(httpURL: string){
        this.dbService.deleteFileFromFireStorageWithHttpsURL(httpURL);
    }

    getNumberOfLoveAndFeedback(itemID: string) {
        return new Promise((resolve, reject) => {
            let NUM_OF_LOVES = 0;
            let NUM_OF_COMMENTS = 0;
            this.dbService.getLengthOfDB('FavoriteOfItemFromUsers/' + itemID)
                .then((res: number) => {
                    NUM_OF_LOVES = res
                })
                .then(() => {
                    this.dbService.getLengthOfDB('FeedbackOfItemFromUsers/' + itemID)
                        .then((res: number) => {
                            NUM_OF_COMMENTS = res;
                            resolve({loveNo: NUM_OF_LOVES, commentsNo: NUM_OF_COMMENTS })
                        })
                        .catch((err)=> resolve(err))
                }).catch((err)=> resolve(err))
        })
    }

    updateObject(ObjURL: string, data){
        return this.afService.updateObjectData(ObjURL, data);
    }

    

    


}