import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { AppService } from '../services/app.service';
import { LocalService } from '../services/local.service';

import { iProfile } from '../interfaces/profile.interface';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "HomePage";

  pages: Array<{ title: string, component: string }>;
  userAvatar: string = null;
  userName: string = null;
  profile: iProfile = null;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private network: Network,
    private localService: LocalService,
    private appService: AppService,
  ) {
    this.initializeApp();
    let disconnected = this.network.onDisconnect().subscribe(() => {
      this.appService.toastMsg('Network disconnected', 5000);
    })

    let connected = this.network.onConnect().subscribe(() => {
      this.appService.toastMsg('Network connected', 5000);
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "HomePage" },
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
      // this.initUserInfo();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter app.html')
  }

  ionOpen() {
    console.log('Menu is opened')
    if (!this.localService.isProfileLoaded) {
      this.localService.initUserInfo()
        .then((profile: iProfile) => {
          console.log(profile)
          this.profile = profile;
          this.userAvatar = this.profile.AVATAR_URL;
          this.userName = this.profile.NAME;
          this.localService.isProfileLoaded = true;
        })
        .catch((err)=>{
          console.log(err);
          this.userAvatar = null;
          this.userName = null;
          this.profile = null;
        })
    }
  }
}

/*
Install Networking:
$ ionic cordova plugin add cordova-plugin-network-information
$ npm install --save @ionic-native/network
*/