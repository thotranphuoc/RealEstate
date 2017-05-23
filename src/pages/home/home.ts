import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: Observable<firebase.User>;
  
  constructor(
    public navCtrl: NavController,
    private afService: AngularFireService,
    ) {
      this.user = this.afService.user;
      this.navCtrl.push('MapPage');
  }

}
