import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage1 {
  user: Observable<firebase.User>;
  loading: any;
  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private afService: AngularFireService,
  ) {
    this.user = this.afService.user;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.startLoading();
    setTimeout(()=>{
      this.navCtrl.setRoot('MapPage');
      this.hideLoading();
    },1000);
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
