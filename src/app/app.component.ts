import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { SoldItemsPage } from '../pages/sold-items/sold-items';
// import { MapPage } from '../pages/map/map';
// import { SettingPage } from '../pages/setting/setting';

import { AppService } from '../services/app.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "HomePage";

  pages: Array<{title: string, component: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private network: Network,
    private appService: AppService ) {
    this.initializeApp();
    let disconnected = this.network.onDisconnect().subscribe(()=>{
      this.appService.toastMsg('Network disconnected', 5000);
    })

    let connected = this.network.onConnect().subscribe(()=>{
      this.appService.toastMsg('Network connected', 5000);
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "HomePage" },
      // { title: 'List', component: "ListPage" },
      // { title: 'Sold Items', component: "SoldItemsPage" },
      // { title: 'Maps', component: "MapPage" },
      { title: 'Setting', component: "SettingPage" },
      { title: 'Tips', component: "TipsPage" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

/*
Install Networking:
$ ionic cordova plugin add cordova-plugin-network-information
$ npm install --save @ionic-native/network
*/