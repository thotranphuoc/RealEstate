import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-sold-items',
  templateUrl: 'sold-items.html',
})
export class SoldItemsPage {
  items: FirebaseListObservable<any[]>;
  item: FirebaseObjectObservable<any>
  maxNum: number;
  constructor(
    private afService: AngularFireService, 
    private db: AngularFireDatabase, 
    private dbService: DbService ) {
      this.maxNum = this.dbService.getSetting().numOfItems;
    // this.items = db.list('/soldItems');
    this.items = this.afService.getListWithCondition('soldItems/', 'VISIBLE', true, this.maxNum)
    // this.item = this.afService.getObjectSnapshot('items/14');
    console.log(this.dbService.getSetting().numOfItems);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoldItemsPage');
  }

}
