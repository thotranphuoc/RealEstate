import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iPosition } from '../../interfaces/position.interface';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-your-sell-item',
  templateUrl: 'your-sell-item.html',
})
export class YourSellItemPage {
  items: any[] = [];
  soldItems = [];
  IS_DETAILED: boolean[] = [];
  IS_REMOVED: boolean[] = [];

  NUM_OF_LOVES: number[] = [];
  isNUM_OF_LOVE: boolean = false;
  NUM_OF_COMMENTS: number[] = [];
  isNUM_OF_COMMENTS: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService) {

    this.afService.getList('UserSoldItems/' + this.afService.getAuth().auth.currentUser.uid)
        .subscribe((data) => {
          console.log(data);
          this.items = data;
          this.items.forEach(item => {
            this.afService.getObject('soldItems/' + item.key)
              .subscribe(soldItem => {
                console.log(soldItem);
                soldItem['new_PRICE'] = this.appService.convertToCurrency(soldItem.PRICE.toString(), ','); // convert PRICE
                soldItem['new_KIND'] = this.appService.convertCodeToDetail(soldItem.KIND); // convert KIND
                this.soldItems.push(soldItem);

                this.IS_DETAILED.push(false);
                this.IS_REMOVED.push(false);

              })
              // .unsubscribe();
          })

          this.items.forEach(item => {
            this.getNumberFeedbackOfItemFromUsers(item.key);
            this.getNumberLoveOfItemFromUsers(item.key);
          })
        })
        // .unsubscribe()


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourSellItemPage');
  }

  showLess(index: number) {
    this.IS_DETAILED[index] = false;
    console.log('Show Less...', index);
  }

  showMore(index: number) {
    this.IS_DETAILED[index] = true;
    console.log('Show More...', index);
  }

  getNumberLoveOfItemFromUsers(key) {
    this.dbService.getLengthOfDB('FavoriteOfItemFromUsers/' + key)
      .then((res: number) => {
        this.NUM_OF_LOVES.push(res);
      })
  }

  getNumberFeedbackOfItemFromUsers(key) {
    this.dbService.getLengthOfDB('FeedbackOfItemFromUsers/' + key)
      .then((res: number) => {
        this.NUM_OF_COMMENTS.push(res);
      })
  }

  deleteSellingItem(item: iSoldItem, itemId: string, index) {
    console.log(item, itemId, index);
    if(item.PHOTOS !=null){
      item.PHOTOS.forEach(photo=>{
        console.log(photo)
        this.dbService.deleteFileFromFireStorageWithHttpsURL(photo);
      })
    }
    this.appService.deleteItemWithURL(item.UID, itemId );
    // this.appService.deleteItem(this.afService.getAuth().auth.currentUser.uid, key);
  }

  onDeleteSellingItem(item: iSoldItem, itemId: string,  index: number) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteSellingItem(item,itemId,index);
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

  onUpdateSellingItem(key, id) {
    console.log('update: ', key);

    this.navCtrl.push('AddItemPage', { action: 'update-item', soldItem_ID: key });
  }

}
