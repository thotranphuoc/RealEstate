import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { GmapService } from './gmap.service';

import { iSoldItem } from '../interfaces/sold-item.interface';
import { iFeedback } from '../interfaces/feedback.interface';
import { iPosition } from '../interfaces/position.interface';
import { iSetting } from '../interfaces/setting.interface';
declare var google: any;

@Injectable()

export class DbService {
    // SoldItemList: {key: string, data: iSoldItem}[] = [];  // load from DB
    soldItems: { key: string, data: iSoldItem }[] = []; // items got from firebase 
    markers: any[] =[];
    // soldItem: iSoldItem = null; // item to upload to firebase
    detectedUserPosition: iPosition = { lat: 0, lng: 0 };
    userCurrentPosition: iPosition = { lat: 0, lng: 0 }; // user's detected position
    // userCurrentLatLng = new google.maps.LatLng(0,0);
    userChosenPosition: iPosition = { lat: 0, lng: 0 };  // user's chosen postion
    isUserChosenPositionSet: boolean = false;  // location is set/ fixed or not

    base64Images: string[] = [];

    Results = [];
    ItemList = [];

    feedback: iFeedback = {
        SOLDOUT: false,
        WRONGPIC: false,
        WRONGPHONE: false,
        WRONGLOCATION: false,
        WRONGPRICE: false,
        POSTTIME: '',
        COMMNENTS: null,
        NAME: null,
        STARS: null
    };

    soldItem: iSoldItem = {
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

    // soldItem = this.defaultSoldItem;

    setting: iSetting = {
        setHouse: true,
        setApartment: true,
        setLand: true,
        setOther: true,
        language: 'English',
        numOfItems: 50
    };


    locations = [
        { lat: 11.563910, lng: 106.154312 },
        { lat: 13.718234, lng: 106.363181 },
        { lat: 13.727111, lng: 106.371124 },
        { lat: 13.848588, lng: 106.209834 },
        { lat: 13.851002, lng: 106.216968 },
        { lat: 10.671264, lng: 106.863657 },
        { lat: 15.304724, lng: 108.662905 },
        { lat: 16.810685, lng: 106.699196 },
        { lat: 16.828611, lng: 106.790222 },
        { lat: 10.750000, lng: 106.116667 },
        { lat: 10.759859, lng: 106.128708 },
        { lat: 10.765015, lng: 106.133858 },
        { lat: 10.770104, lng: 106.103299 },
        { lat: 10.773700, lng: 106.106187 },
        { lat: 10.774785, lng: 106.137978 },
        { lat: 10.819616, lng: 106.968119 },
        { lat: 18.330766, lng: 106.695692 },
        { lat: 19.927193, lng: 106.053218 },
        { lat: 11.330162, lng: 104.865694 },
        { lat: 12.734358, lng: 106.439506 },
        { lat: 12.734358, lng: 106.501315 },
        { lat: 12.735258, lng: 106.438000 },
        { lat: 13.999792, lng: 100.463352 }
    ];
    labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


    // OFF TAM THOI
    // constructor(
    //     // private gmapService: GmapService
    //     ) {
    //     this.ItemList = this.getAllItemsOnce('items');
    //     // this.onDBChanged('items');
    //     this.onItemsChanged('items');
    // }

    // insertOneNewItem(item, dbName) {
    //     let db = firebase.database().ref(dbName);
    //     db.push(item)
    //     .then(() => {
    //         console.log(item, 'just added to db');
    //     }).catch(err => console.log(err));
    // }

    insertOneNewItemReturnPromise(item, dbName) {
        let db = firebase.database().ref(dbName);
        return db.push(item);
    }

    insertOneNewItemWithSetReturnPromise(item, dbName) {
        let db = firebase.database().ref(dbName);
        return db.set(item);
    }

    removeOneItemFromDBReturnPromise(item, dbURL) {
        console.log(dbURL + '/' + item);
        return firebase.database().ref(dbURL + '/' + item).remove();
    }

    getOneItemReturnPromise(dbURL) {
        let db = firebase.database().ref(dbURL);
        return db.once('value')
        // .then((data)=>{
        //     console.log(data.val());
        // })
        // .catch(err=>{
        //     console.log(err)
        // })
    }

    // getAllItemsOnce(dbName: string): iItem[] {
    //     this.Results = [];
    //     let items = firebase.database().ref(dbName);
    //     items.once('value', (snapshot) => {
    //         snapshot.forEach((childSnap) => {
    //             let item = {
    //                 key: childSnap.key,
    //                 body: childSnap.val().body,
    //                 name: childSnap.val().name
    //             }
    //             this.Results.push(item);
    //             return false
    //         })
    //     })
    //     return this.Results;
    // }

    // onDBChanged(dbName: string){
    //     let dbList = [];
    //     let items = firebase.database().ref(dbName);
    //     items.on('value', (snapshot)=>{
    //         snapshot.forEach((childSnap) =>{
    //             let item = {
    //                 key: childSnap.key,
    //                 body: childSnap.val().body,
    //                 name: childSnap.val().name
    //             }
    //             dbList.push(item);
    //             return false
    //         })
    //     })
    //     this.ItemList = dbList;
    // }

    // // EVENTS LISTENER
    // onItemsChanged(dbName: string) {
    //     let items = firebase.database().ref(dbName);
    //     items.on('value', (snaphot) => {
    //         console.log('value: ', snaphot.val());
    //     });

    //     // NEW CHILD ADDED EVENT
    //     items.on('child_added', (snaphot) => {
    //         let item = {
    //             key: snaphot.key,
    //             body: snaphot.val().body,
    //             name: snaphot.val().name
    //         }
    //         this.ItemList.push(item); //update the itemList
    //         console.log('child_added: ', snaphot.val());
    //     });

    //     // ONE CHILD REMOVE
    //     items.on('child_removed', (snaphot) => {
    //         let key = snaphot.key;
    //         let i = this.ItemList.map(item => item.key).indexOf(key);
    //         console.log('i=', i)
    //         this.ItemList.splice(i, 1);
    //         console.log('child_removed: ', snaphot.val());
    //     });
    //     items.on('child_changed', (snaphot) => {
    //         console.log('child_changed: ', snaphot.val());
    //     });
    //     items.on('child_moved', (snaphot) => {
    //         console.log('child_moved : ', snaphot.val());
    //     });
    // }

    // getItems() {
    //     return this.ItemList
    // }

    // addItem(item: any, dbName: string) {
    //     // this.ItemList.push(item);
    //     let db = firebase.database().ref(dbName);
    //     db.push(item);
    // }

    // USER LOCATION DATA 
    // getUserCurrentPostion() {
    //     this.gmapService.getCurrentLocationReturnPromise()
    //     .then((data)=>{
    //         console.log(data);
    //     })
    //     .catch(err=>console.log(err));
    //     // return this.userCurrentPosition;
    // }


    setSoldItems(items) {
        this.soldItems = items;
    }
    getSoldItems() {
        return this.soldItems;
    }

    setMarkers(markers){
        this.markers = markers;
    }
    
    getMarkers(){
        return this.markers;
    }

    setFeedback(feedback: iFeedback) {
        this.feedback = feedback;
    }

    getFeedback() {
        return this.feedback;
    }

    setSetting(setting: iSetting) {
        this.setting = setting;
    }

    getSetting() {
        return this.setting;
    }

    setUserCurrentPosition(position: iPosition) {
        this.userCurrentPosition = position;
        console.log('userPosition set: ', this.userCurrentPosition);
    }
    getUserCurrentPosition() {
        return this.userCurrentPosition;
    }

    setUserChosenPosition(position: iPosition) {
        this.userChosenPosition = position;
        console.log('userPosition set: ', this.userChosenPosition);
    }
    getUserChosenPosition() {
        return this.userChosenPosition;
    }

    // setUserCurrentLatLng(latLng: google.maps.LatLng){
    //     this.userCurrentLatLng = latLng;
    // }
    getUserCurrentLatLng() {
        return new google.maps.LatLng(this.userCurrentPosition.lat, this.userCurrentPosition.lng);
    }





    getLocations(): iPosition[] {
        return this.locations;
    }



    // USER CAPTURED PHOTOS
    getUserCapturedBase64Images(): string[] {
        return this.base64Images;
    }

    addUserCapturedBase64Image(imageData: string): void {
        if (this.base64Images.length < 6) {
            this.base64Images.push(imageData);
        }
    }

    uploadImage2Firebase(imageData) {
        let file = imageData;
        let imageName: string = 'IMG_' + new Date().getTime() + '.jpg';
        let metadata = { contentType: 'image/jpeg' };
        let uploadTask = firebase.storage().ref('images/' + imageName).putString(imageData, 'data_url', metadata);

        // listen on state changes, errors, and completion of uploading
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (_snapshot) => {
            // get the progress, including the number of bytes uploaded, and total number of bytes to be uploaded
            let progress = (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (_snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, (err) => {

        }, () => {
            // upload completed successfully, now can get the download URLs
            let downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
        })
    }

    uploadBase64Image2FB(imageData: string, URL: string) {
        let imageName: string = 'IMG_' + new Date().getTime() + '.jpg';
        let storageRef = firebase.storage().ref(URL+'/' + imageName);
        return storageRef.putString(imageData, 'data_url', { contentType: 'image/png' })
        // .then((_snapshot)=>{
        //     alert('photo uploaded' + _snapshot);
        // })
        // .catch(err=>{'uploaded fail: '+ err});
    }
    uploadBase64Image2FbReturnString(imageData: string) {
        let dlURL = '';
        let imageName: string = 'IMG_' + new Date().getTime() + '.jpg';
        let storageRef = firebase.storage().ref('images/' + imageName);
        storageRef.putString(imageData, 'data_url', { contentType: 'image/png' })
            .then((_snapshot) => {
                alert('photo uploaded' + _snapshot);
                dlURL = _snapshot.downloadURL;
            })
            .catch(err => { 'uploaded fail: ' + err });
        return dlURL;
    }

    // Upload 1 image to firebase storage
    uploadBase64Image2Firebase(imageData) {
        return new Promise((resolve, reject) => {
            let downloadUrl: string = '';
            let imageName: string = 'IMG-' + new Date().getTime() + '.jpg';
            let storageRef = firebase.storage().ref('images/' + imageName);
            let uploadTask = storageRef.putString(imageData, 'data_url', { contentType: 'image/png' });
            uploadTask.then(_snapshot => {
                let data = {
                    downloadUrl: _snapshot.downloadURL,
                    name: imageName
                }
                resolve(data);
            }, (err) => {
                reject(err);
            })
                .catch(err => {
                    reject(err);
                })
            // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //     MESSAGE_TO_DISPLAY = 'Upload is ' + progress + '% done';
            //     console.log(MESSAGE_TO_DISPLAY);

            // }, (err) => {
            //     // on error
            //     reject(err);
            // }, () => {
            //     // upload completed
            //     let data = {
            //         downloadUrl: uploadTask.snapshot.downloadURL,
            //         name: imageName
            //     };
            //     // downloadUrl = uploadTask.snapshot.downloadURL;
            //     resolve(data);

            // });
        })
    }

    // UPLOAD many images to firebase storage at the same time, then return an array of downloadURL
    uploadBase64Images2FirebaseReturnPromise(imagesData: string[], URL: string) {
        let promises = [];

        if (typeof (imagesData) != 'undefined') {
            let length = imagesData.length;
            imagesData.forEach((imageData, index) => {
                promises[index] = new Promise((resolve, reject) => {
                    this.uploadBase64Image2FB(imageData, URL)
                        .then((data) => {
                            let url = data.downloadURL;
                            resolve(url);
                        }, err => {
                            reject(err);
                        }).catch(err => {
                            reject(err);
                        })
                })
            })
        }
        return Promise.all(promises);
    }

    // UPLOAD 1 image to firebase storage. then return a promise
    uploadBase64Image2FirebaseReturnPromise(url: string, imageData: string): firebase.storage.UploadTask {
        // let imageName: string = 'IMG_' + new Date().getTime() + '.jpg';
        let storageRef = firebase.storage().ref(url);
        return storageRef.putString(imageData, 'data_url', { contentType: 'image/png' })
        // .then((_snapshot)=>{
        //     alert('photo uploaded' + _snapshot);
        // })
        // .catch(err=>{'uploaded fail: '+ err});
    }

    // uploadBase64Images2FB(imageDatas: string[]): string[] {
    //     let dlURLs = [];
    //     imageDatas.forEach(imageData => {
    //         this.uploadBase64Image2FB(imageData)
    //             .then(_snapshot => {
    //                 alert(_snapshot.downloadURL);
    //                 dlURLs.push(_snapshot.downloadURL);

    //             })
    //     });
    //     return dlURLs;
    // }

    // UPLOAD FILE TO STORAGE

    uploadFileToFB(file: string) {

    }

    // DATA TO UPLOAD

    getSoldItem(): iSoldItem {
        return this.soldItem;
    }

    setSoldITem(soldItem: iSoldItem): void {
        this.soldItem = soldItem;
        console.log(this.soldItem);
    }

    // GET ITEMS FROM FIREBASE
    getItemsFromFirebaseReturnObjectArray(dBName): any[] {
        let items = [];
        let db = firebase.database().ref(dBName);
        db.once('value', (_snapshot) => {
            items = _snapshot.val();
            console.log(items);
        })
        return items;
    }

    getSoldItemsFromFirebaseReturnArrayWithKey_Data(dBName) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dBName);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let key = _childSnap.key;
                    let data = _childSnap.val();
                    let item = {
                        key: key,
                        data: data
                    }
                    // console.log(key, data)
                    // console.log(item)
                    items.push(item);
                    return false;
                })
                this.setSoldItems(items);
                console.log(this.soldItems);

            });
            resolve(this.soldItems);
            reject('err');

            //TODO: check again. Nhieeu truog hop resolve truoc khi this.soldItems hoan thanh
        })
    }

    getItemsFromFBReturnPromise(dbNameURL: string): firebase.Promise<any> {
        let db = firebase.database().ref(dbNameURL);
        return db.once('value')
    }

    getLocationsFromFirebase(): iSoldItem[] {
        let items = [];
        let db = firebase.database().ref('soldItems');
        db.once('value', (_snapshot) => {
            items = _snapshot.val();
            console.log(items);
        })
        return items;
    }

    updateItemList(items) {
        this.ItemList = items
    }
    getUpdatedItemList() {
        return this.ItemList;
    }

    getLengthOfDB(dbURL: string) {
        return new Promise((resolve, reject) => {
            let n: number = 0;
            let db = firebase.database().ref(dbURL);
            db.on('value', (snapshot) => {
                n = snapshot.numChildren();
                resolve(n);
            })

        })

    }

    deleteFileFromFireStorageWithURL(url: string){
        let storageRef = firebase.storage().ref(url);
        return storageRef.delete()
    }

    // Create a reference from an HTTPS URL
    // such as: storage.refFromURL('https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');
    deleteFileFromFireStorageWithHttpsURL(httpsURL: string){
        let storage = firebase.storage().refFromURL(httpsURL);
        return storage.delete();
    }

    // getAllItemsOnce(dbName: string): iItem[] {
    //     this.Results = [];
    //     let items = firebase.database().ref(dbName);
    //     items.once('value', (snapshot) => {
    //         snapshot.forEach((childSnap) => {
    //             let item = {
    //                 key: childSnap.key,
    //                 body: childSnap.val().body,
    //                 name: childSnap.val().name
    //             }
    //             this.Results.push(item);
    //             return false
    //         })
    //     })
    //     return this.Results;
    // }


}

// interface iItem {
//     key: string,
//     body: string,
//     name: string
// }

// interface iPosition {
//     lat: number,
//     lng: number
// }

