import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user: Observable<firebase.User>;
  loading: any;
  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private afService: AngularFireService,
    private dbService: DbService
  ) {
    this.user = this.afService.user;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    
    this.startLoading();
    setTimeout(() => {
      this.navCtrl.setRoot('MapPage');
      this.hideLoading();
    }, 1000);
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

}
