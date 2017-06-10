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
  isMultiSelect: boolean = false;
  numberOfSelected: number = 0;
  selectedItems: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private afService: AngularFireService,
    private appService: AppService) {
    this.afService.getList('soldItems').subscribe((items) => {
      this.imgNotAvailable = 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Fhouse.jpg?alt=media&token=7d55aa45-66b0-497b-aaa5-466a5a28057b';
      console.log(items);
      this.items = items;
      this.items.map(item => {
        if (typeof (item.PRICE) != 'undefined') {
          item['new_PRICE'] = this.appService.convertToCurrency(item.PRICE.toString(), ','); // convert PRICE
        }
        if (typeof (item.KIND) != 'undefined') {
          item['new_KIND'] = this.appService.convertCodeToDetail(item.KIND); // convert KIND
        }
        item['isSelected'] = false;
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

  doMulti(){
    this.isMultiSelect = !this.isMultiSelect;
    console.log(this.isMultiSelect);
    if(!this.isMultiSelect){
      // clear all selected items
      this.items.forEach(item => {
        item.isSelected = false;
      });

      // hide ion-footer
      this.numberOfSelected = 0;
    }
  }

  doSelect(item, i){
    this.items[i].isSelected = !this.items[i].isSelected;
    console.log(item, i);
    if(this.items[i].isSelected){
      this.numberOfSelected ++;
    }else{
      this.numberOfSelected --;
    }

    console.log(this.numberOfSelected);
  }

  deleteItems(){
    this.selectedItems = [];
    console.log('delete selected items');
    this.items.forEach(item => {
      if(item.isSelected){
        this.selectedItems.push({userID: item.UID, key: item.$key})
      }
    });
    console.log(this.selectedItems);
    this.selectedItems.forEach(item => {
      this.deleteSellingItem(item.userID, item.key);
    });
    this.numberOfSelected = 0;
    this.doMulti();
   
  }
  go2ItemDetail(item){
    delete item.isSelected;
    delete item.new_KIND;
    delete item.new_PRICE;
    console.log(item);
    this.navCtrl.push('ShowItemDetailPage', {key: item.$key, data: item });
  }

}
