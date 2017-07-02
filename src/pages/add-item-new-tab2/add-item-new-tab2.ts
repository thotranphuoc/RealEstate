import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ActionSheetController } from 'ionic-angular';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iImage } from '../../interfaces/image.interface';

import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

@IonicPage()
@Component({
  selector: 'page-add-item-new-tab2',
  templateUrl: 'add-item-new-tab2.html',
})
export class AddItemNewTab2Page {
  isCordova: boolean = false;
  soldItem: iSoldItem;
  action: string = 'add-new';


  // BROWSER CAMERA
  selectedFiles: FileList;
  imageDatas: any[] = [];
  resizedImageDatas: any[] = [];
  existingImageUrls: string[] = [];
  images: iImage[] = [];
  resultMsg: string;
  isUploadBtnEnabled: boolean = false;
  numberOfImages: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private app: App,
    private viewCtrl: ViewController,
    private dbService: DbService,
    private localService: LocalService) {
    this.soldItem = this.dbService.getSoldItem();
    console.log(this.soldItem);
    this.action = this.localService.getItemAction();
    console.log(this.action);
    this.images = this.localService.getImages();
    this.numberOfImages = this.images.length;
    this.existingImageUrls = this.soldItem.PHOTOS;

  }

  ionViewWillEnter() {
    // this.soldItem = this.dbService.getSoldItem();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave AddItemNewTab2Page');
    this.localService.setExistingImageUrls(this.existingImageUrls);
    this.localService.setResizedImages(this.resizedImageDatas);
    this.localService.setImages(this.images);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab2Page');
    // this.soldItem = this.dbService.getSoldItem();
  }

  // // === FOR BROWSER CAMERA
  // detectFiles(event) {
  //   // let reader = new FileReader();
  //   this.selectedFiles = event.target.files;
  //   console.log(this.selectedFiles);
  //   console.log('number of files: ', event.target.files.length);

  //   for (var index = 0; index < event.target.files.length + 1; index++) {
  //     if (index < event.target.files.length) {
  //       this.dbService.convertFile2ImageData(this.selectedFiles[index])
  //         .then(imgDataURL => {
  //           // console.log(imgDataURL);
  //           this.imageDatas.push(imgDataURL);
  //         })

  //       // convert files to HTMLImageElement in order to resize
  //       this.dbService.convertFile2ImageElement(this.selectedFiles[index])
  //         .then((el: HTMLImageElement) => {
  //           console.log(el);
  //           this.dbService.resizeImageFromImageElement(el, 750, 750, (resizedImg, before, after) => {
  //             // this.resizedImageDatas.push(resizedImg);
  //             // this.dbService.setResizedImageDatas(this.resizedImageDatas);
  //             // this.numberOfImages++;

  //             this.images.push({ imageURL: resizedImg, isVisible: true, toBeDeleted: false, isNewCapturedImage: true });
  //             this.updateNumberOfImage();
  //             // console.log('Before:', before, 'After: ', after)
  //             // this.resultMsg = 'Before:' + before.toString() + '  After: ' + after.toString();
  //           })
  //         })
  //     }
  //   }
  // }

  resizeSelectedImages(event) {
    this.images = [];
    this.dbService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgUrls: string[]) => {
        console.log(imgUrls);
        setTimeout( ()=> {
          imgUrls.forEach(imgUrl => {
            this.images.push({ imageURL: imgUrl, isVisible: true, toBeDeleted: false, isNewCapturedImage: true })
            console.log(this.images);
          })
          console.log(this.images);
          this.updateNumberOfImage();
        }, 1000);
      }, err => { console.log(err) });
  }

  onChangeImage(i) {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log(this.images[i]);
            this.images[i].isVisible = false;
            this.updateNumberOfImage();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  updateNumberOfImage() {
    let n = 0;
    this.images.forEach(image => {
      if (image.isVisible) {
        n++;
      }
    })
    this.numberOfImages = n;
  }


}
