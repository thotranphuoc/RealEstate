// import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';

// declare var navigator;

// @IonicPage()
// @Component({
//   selector: 'page-camera-browser',
//   templateUrl: 'camera-browser.html',
// })
// export class CameraBrowserPage {
//   imageCaptured: any;
//   reader: FileReader;
//   file_sources: string[] =[];

//   constructor(
//     public navCtrl: NavController, 
//     public navParams: NavParams,
//     private el: ElementRef,
//     private changeDetectorRef: ChangeDetectorRef) {
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad CameraBrowserPage');
//   }

//   // getUserMedia(){
//   //   navigator.mediaDevices.getUserMedia({video: true})
//   //   .then((mediaStream)=>{
//   //     document.querySelector('video').srcObject = mediaStream;
//   //     const track = mediaStream.getVideoTracks[0];
//   //     this.imageCaptured = new ImageCapture(track);
//   //   })
//   // }

//   choosePhotoToUpload(){
//     console.log('submit')
//   }

//   // changeListener(event){
//   //   var reader = new FileReader();
//   //   var image = this.el.nativeElement.querySelector('.image');
//   //   reader.onload = function(event) {
//   //     var src = event.target.
//   //     image.src = src;
//   //   };

//   //   reader.onload(
//   // }

//   // fileChange(input){
//   //   console.log(input);
//   //   this.readFiles(input.files);
//   // }

//   // readFile(file, reader, callback){
//   //   // set a callback function to fire after a file is fully loaded
//   //   reader.onload = () =>{
//   //     callback(reader.result);
//   //   }
//   // }

//   // readFiles(files, index=0){
//   //   // create file reader
//   //   let reader = new FileReader();

//   //   // if there is a file
//   //   if index in files {
      
//   //   }
//   // }

// }

//our root app component
import {Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-camera-browser',
  templateUrl: 'camera-browser.html',
})

export class CameraBrowserPage {
  public file_srcs: string[] = [];
  selectedFiles: FileList;
  imageDatas: any[] =[];
  // currentUpload: Upload;
  constructor( 
    private changeDetectorRef: ChangeDetectorRef,
    private dbService: DbService ) {

    this.resizeNew(1,2,1).then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  
  
  // The next two lines are just to show the resize debug
  // they can be removed
  public debug_size_before: string[] = [];
  public debug_size_after: string[] = [];
  
  // This is called when the user selects new files from the upload button
  fileChange(input){
    this.readFiles(input.files);
    console.log(input.files);
    // console.log(input.file_sources);
    // console.log(input.file_srcs);
  }
  
  readFile(file, reader, callback){
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      // callback with the results
      callback(reader.result);
    }
    
    // Read the file
    reader.readAsDataURL(file);
  }
  
  readFiles(files, index=0){
    // Create the file reader
    let reader = new FileReader();
    
    // If there is a file
    if (index in files){
      // Start reading this file
      this.readFile(files[index], reader, (result) =>{
        // Create an img element and add the image file data to it
        var img = document.createElement("img");
        img.src = result;
        console.log(result)
        
        // Send this img to the resize function (and wait for callback)
        this.resize(img, 500, 500, (resized_jpeg, before, after)=>{
          // For debugging (size in bytes before and after)
          this.debug_size_before.push(before);
          this.debug_size_after.push(after);

          // Add the resized jpeg img source to a list for preview
          // This is also the file you want to upload. (either as a
          // base64 string or img.src = resized_jpeg if you prefer a file). 
          this.file_srcs.push(resized_jpeg);
          
          // Read the next file;
          this.readFiles(files, index+1);
        });
      });
    }else{
      // When all files are done This forces a change detection
      this.changeDetectorRef.detectChanges();
    }
  }

  
  resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      console.log("img loaded");
      // Get the images current width and height
      var width = img.width;
      var height = img.height;
      
      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {
          if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
          }
      } else {
          if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
          }
      }
      
      // create a canvas object
      var canvas = document.createElement("canvas");
    
      // Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");  

      ctx.drawImage(img, 0, 0,  width, height); 
      
      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg');
      
      // callback with the results
      callback(dataUrl, img.src.length, dataUrl.length);
    };
  }

  resizeNew(image: any, MAX_WIDTH:number, MAX_HEIGHT:number): Promise<any>{
    return new Promise((resolve, reject)=>{
      // image.onload().then(()=>{
      //   console.log('image loaded');
      //   let width = image.width;
      //   let height = image.height;
      // })

      resolve('Success');
      reject('Fail');
    })
    
  }


  detectFiles(event){
    let reader = new FileReader();
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
    console.log('number of files: ', event.target.files.length);
    for (var index = 0; index < event.target.files.length; index++) {
      // this.readFile(this.selectedFiles[index], reader, (imageData)=>{
      //   this.imageDatas.push(imageData);
      //   console.log(imageData);
      // })

      this.dbService.convertFile2ImageData(this.selectedFiles[index]).then(res=>{
        console.log(res);
        this.imageDatas.push(res);
      })
      
    }

  }

  uploadSingle(){
    let file = this.selectedFiles.item(0);
    console.log(file);
    // this.dbService.uploadFile2FB('/uploads', file);
    this.dbService.uploadFile2FBReturnPromiseWithURL('uploads', file, new Date().getTime().toString())
    .then(url=>{ console.log(url)})
    .catch(err=>{ console.log(err)})
  }

  uploadMultiple(){
    let length = this.selectedFiles.length;
    let files = [];
    for (var index = 0; index < length; index++) {
      files.push(this.selectedFiles.item(index)) 
    }
    
    let name = new Date().getTime().toString();
    this.dbService.uploadFiles2FBReturnPromiseWithArrayOfURL('uploads',files, name)
    .then((res)=>{
      console.log(res);
    })
    .catch(err=>{console.log(err)})

  }
}