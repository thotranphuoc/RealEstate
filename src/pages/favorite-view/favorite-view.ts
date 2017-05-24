import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { AngularFireService } from '../../services/af.service';
import { iFavorite } from '../../interfaces/favorite.interface';
import { iSoldItem } from '../../interfaces/sold-item.interface';
@IonicPage()
@Component({
  selector: 'page-favorite-view',
  templateUrl: 'favorite-view.html',
})
export class FavoriteViewPage {
  favorites: iFavorite[] = [];
  favoriteItems: iSoldItem[] = [];
  // favoriteItemsDetail: any[] =[];
  IS_DETAILED: boolean[] = [];
  IS_REMOVED: boolean[] = [];
  loveNComments: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private afService: AngularFireService,
    private appService: AppService) {

    this.afService.getList('FavoriteOfUserForItems/' + this.afService.getAuth().auth.currentUser.uid)
      .subscribe((list) => {
        this.favorites = list;
        console.log(this.favorites);
        this.favoriteItems = [];
        this.IS_DETAILED = [];
        this.IS_REMOVED = [];
        this.loveNComments = [];
        // this.favoriteItemsDetail = [];
        this.favorites.forEach(favorite => {
          this.afService.getObject('soldItems/' + favorite.itemID)
            .subscribe((item) => {
              console.log(item);
              item['new_PRICE'] = this.appService.convertToCurrency(item.PRICE.toString(), ','); // convert PRICE
              item['new_KIND'] = this.appService.convertCodeToDetail(item.KIND); // convert KIND
              this.favoriteItems.push(item);
              // this.favoriteItemsDetail.push(item);

              this.IS_DETAILED.push(false);
              this.IS_REMOVED.push(false);
              this.appService.getNumberOfLoveAndFeedback(item.$key).then((res) => {
                console.log(res);
                this.loveNComments.push(res);
              })
              console.log(this.favoriteItems);
              console.log(this.loveNComments);
              // console.log(this.favoriteItemsDetail);
            })
        })
      })
      // .unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoriteViewPage');
  }

  onDeleteFromFavorite(key: string,index: number){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: ()=>{
            this.deleteFromFavorite(key, index);
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

  deleteFromFavorite(itemID, index){
    console.log(index, itemID);
    this.appService.removeFavorite(this.afService.getAuth().auth.currentUser.uid, itemID );
    // this.favoriteItems.splice(index,1);
  }

  go2Detail(item, key){
    console.log(item, key);

    this.navCtrl.push('ShowItemDetailPage', {key: key, data: item});

  }

}
