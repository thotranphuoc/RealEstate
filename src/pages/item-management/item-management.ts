import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';


import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';

import { iSoldItem } from '../../interfaces/sold-item.interface';

@IonicPage()
@Component({
  selector: 'page-item-management',
  templateUrl: 'item-management.html',
})
export class ItemManagementPage {
  items: any;
  imgNotAvailable: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private afService: AngularFireService,
    private appService: AppService) {
    this.afService.getList('soldItems').subscribe((items) => {
      this.imgNotAvailable = '../../assets/img/house.jpg';
      console.log(items);
      this.items = items;
      this.items.map(item => {
        if (typeof (item.PRICE) != 'undefined') {
          item['new_PRICE'] = this.appService.convertToCurrency(item.PRICE.toString(), ','); // convert PRICE
        }
        if (typeof (item.KIND) != 'undefined') {
          item['new_KIND'] = this.appService.convertCodeToDetail(item.KIND); // convert KIND
        }
      });
      console.log(this.items);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemManagementPage');
  }

  toggleEye(item: iSoldItem, key){
    console.log(item, item.VISIBLE);
    item.VISIBLE = !item.VISIBLE;
    this.afService.updateObjectData('soldItems/'+key, { VISIBLE: item.VISIBLE })
    .then((res)=>{
      console.log('update successfully', res);
    })
    // this.appService.updateObject('soldItems/'+ key, {VISIBLE: item.VISIBLE})
  }

  deleteSellingItem(userID, itemID: string) {
    // let userID = this.afService.getAuth().auth.currentUser.uid;
    this.appService.deleteSellingItem(userID, itemID);
  }

  onDeleteSellingItem(userID: string, itemId: string) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteSellingItem(userID, itemId);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }

      ]
    });
    actionSheet.present();
  }

}
