import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tips',
  templateUrl: 'tips.html',
})
export class TipsPage {

  tips: any[] = [
    { title: 'How to add web link to home screen in iOS', page: 'TipsIosPage'},
    { title: 'How to add web link to home screen in Android', page: 'TipsAndroidPage'}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TipsPage');
  }

  go2Page(index: number){
    this.navCtrl.push(this.tips[index].page);
  }

}
