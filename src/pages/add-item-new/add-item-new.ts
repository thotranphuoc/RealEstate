import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddItemNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-item-new',
  templateUrl: 'add-item-new.html',
})
export class AddItemNewPage {
  
  tab1Root = 'AddItemNewTab1Page';
  tab2Root = 'AddItemNewTab2Page';
  tab3Root = 'AddItemNewTab3Page';
  tab4Root = 'AddItemNewTab4Page';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewPage');
  }

}
