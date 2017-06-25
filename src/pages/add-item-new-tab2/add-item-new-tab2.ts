import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-add-item-new-tab2',
  templateUrl: 'add-item-new-tab2.html',
})
export class AddItemNewTab2Page {
  isCordova: boolean = false;

   // BROWSER CAMERA
  selectedFiles: FileList;
  imageDatas: any[] = [];
  resizedImageDatas: any[] = [];
  resultMsg: string;
  isUploadBtnEnabled: boolean = false;
  numberOfImages: number = 0;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab2Page');
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
              this.dbService.setResizedImageDatas(this.resizedImageDatas);
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
    this.dbService.setResizedImageDatas(this.resizedImageDatas);
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

}
