import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tips-ios',
  templateUrl: 'tips-ios.html',
})
export class TipsIosPage {
  iosImages: any[] = [
    { url: 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2F1.jpg?alt=media&token=92b74ff4-be33-4158-a683-e29055de2f6e', desc: 'Step 1: Select the icon in blue circle'},
    { url: 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2F2.jpg?alt=media&token=1284140b-4bea-4350-b7f7-70a29903c255', desc: 'Step 2: Add to HomeScreen'},
    { url: 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2F3.jpg?alt=media&token=8e9945ac-3930-4f71-a363-76371b71121b', desc: 'Step 3: Choose the name of app you like'},
    { url: 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2F4.jpg?alt=media&token=649693da-f4c1-4b7d-a0c6-4d780bc6c9d4', desc: 'Step 4: Your app is ready in Home Screen'}
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TipsIosPage');
  }

}
