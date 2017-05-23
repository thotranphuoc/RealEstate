import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-sold-items',
  templateUrl: 'sold-items.html',
})
export class SoldItemsPage {
  items: FirebaseListObservable<any[]>;
  item: FirebaseObjectObservable<any>
  constructor(
    private afService: AngularFireService, 
    private db: AngularFireDatabase ) {
    this.items = db.list('/soldItems');
    this.item = this.afService.getObjectSnapshot('items/14');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoldItemsPage');
  }

}
