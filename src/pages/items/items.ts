import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { GmapService } from '../../services/gmap.service';
import { iSoldItem } from '../../interfaces/sold-item.interface';
@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {
  imgNotAvailable;
  soldItems = [];
  maxNum:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService,
    private gmapService: GmapService ) {
    this.imgNotAvailable = '../../assets/img/house.jpg';
    this.maxNum = this.dbService.getSetting().numOfItems;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
    this.soldItems = this.dbService.getSoldItems();
    this.soldItems.map(item => {
        if (typeof (item.data.PRICE) != 'undefined') {
          item['new_PRICE'] = this.appService.convertToCurrency(item.data.PRICE.toString(), ','); // convert PRICE
        }
        if (typeof (item.data.KIND) != 'undefined') {
          item['new_KIND'] = this.appService.convertCodeToDetail(item.data.KIND); // convert KIND
        }
        if(typeof(item.data.POSITION) != 'undefined') {
          item['distances'] = this.gmapService.getDistanceFromCurrent(item.data.POSITION.lat, item.data.POSITION.lng);
        }
      })
      console.log(this.soldItems);
      // this.soldItems.sort((a,b)=>{
      //   let ax = a.distances.distance;
      //   let bx = a.distances.distance;
      //   return bx - ax;
      // })

    // this.afService.getListWithCondition('soldItems/', 'VISIBLE',true, this.maxNum)
    // .subscribe((items) => {
    //   this.soldItems = items;

    //   this.soldItems.map(item => {
    //     if (typeof (item.PRICE) != 'undefined') {
    //       item['new_PRICE'] = this.appService.convertToCurrency(item.PRICE.toString(), ','); // convert PRICE
    //     }
    //     if (typeof (item.PRICE) != 'undefined') {
    //       item['new_KIND'] = this.appService.convertCodeToDetail(item.KIND); // convert KIND
    //     }
    //     if(typeof(item.POSITION) != 'undefined') {
    //       item['distances'] = this.gmapService.getDistanceFromCurrent(item.POSITION.lat, item.POSITION.lng);
    //     }
    //   })
    //   this.soldItems.sort((a,b)=>{
    //     let ax = a.distances.distance;
    //     let bx = a.distances.distance;
    //     return bx - ax;
    //   })
    // })
  }

  go2Map() {
    this.navCtrl.pop();
  }

  go2ItemDetail(item, key){
    console.log(item);
    delete item.new_KIND;
    delete item.new_PRICE;
    console.log(item);
    this.navCtrl.push('ShowItemDetailPage', {key: key, data: item});
  }

}
