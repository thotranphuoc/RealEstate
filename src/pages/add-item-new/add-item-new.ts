import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iImage } from '../../interfaces/image.interface';

import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
@IonicPage()
@Component({
  selector: 'page-add-item-new',
  templateUrl: 'add-item-new.html',
})
export class AddItemNewPage {
  // tabsEnabled: boolean = true;
  tab1Root = 'AddItemNewTab1Page';
  tab2Root = 'AddItemNewTab2Page';
  tab3Root = 'AddItemNewTab3Page';
  tab4Root = 'AddItemNewTab4Page';
  soldItem: iSoldItem;
  action: string = 'add-new';

  images: iImage[] = []
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService) {
    this.action = this.navParams.get('action');
    if (this.action === 'item-update') {
      this.soldItem = this.navParams.get('soldItem');
      if (this.soldItem.PHOTOS) {
        this.soldItem.PHOTOS.forEach(photo => {
          this.images.push({ imageURL: photo, isVisible: true, isNewCapturedImage: false, toBeDeleted: false })
        })
      }
      this.localService.setIsUserChosenPositionSet(true);
      this.localService.setImages(this.images);
      console.log(this.action, this.soldItem);
      this.dbService.setSoldITem(this.soldItem);
      this.localService.setItemAction(this.action);
      this.localService.setExistingSoldItemID(this.navParams.get('soldItem').$key)
      this.localService.setOrgExistingImageUrls(this.soldItem.PHOTOS);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter AddItemNewPage');
    // this.tabsEnabled = true;
  }

}
