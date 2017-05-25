import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { iSoldItem } from '../../interfaces/sold-item.interface';
@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {
  imgNotAvailable;
  soldItems: iSoldItem[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afService: AngularFireService,
    private appService: AppService) {
    this.imgNotAvailable = '../../assets/img/house.jpg';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
    this.afService.getList('soldItems').subscribe((items) => {
      this.soldItems = items;
      this.soldItems.map(item => {
        item['hi'] = 'HELLO';
        if (typeof (item.PRICE) != 'undefined') {
          item['new_PRICE'] = this.appService.convertToCurrency(item.PRICE.toString(), ','); // convert PRICE
        }
        if (typeof (item.PRICE) != 'undefined') {
          item['new_KIND'] = this.appService.convertCodeToDetail(item.KIND); // convert KIND
        }
      })

      console.log(this.soldItems);
    })
  }

  go2Map() {
    this.navCtrl.pop();
  }

}
