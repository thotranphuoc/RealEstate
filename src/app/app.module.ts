import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { SoldItemsPage } from '../pages/sold-items/sold-items';
// import { MapPage } from '../pages/map/map';
// import { SettingPage } from '../pages/setting/setting';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { Network } from '@ionic-native/network';
import {
 GoogleMaps
} from '@ionic-native/google-maps';
// self services
import { AngularFireService } from '../services/af.service';
import { GmapService } from '../services/gmap.service';
import { DbService } from '../services/db.service';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { CameraService } from '../services/camera.service';
import { LocalService } from '../services/local.service';

// set up for angularfire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import enviroment
import { enviroment } from '../enviroments/enviroment'
// set up for firebase
import * as firebase from 'firebase';
const firebaseConfig = {
  
    apiKey: "AIzaSyAf1-QYPFKYvSP4zsgd1rAPgGv_vsEWCzE",
    authDomain: "auth-38cb7.firebaseapp.com",
    databaseURL: "https://auth-38cb7.firebaseio.com",
    storageBucket: "auth-38cb7.appspot.com",
    messagingSenderId: "304243304728"
};

firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    MyApp,
    // HomePage,
    // ListPage,
    // SoldItemsPage,
    // MapPage,

    // SettingPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(enviroment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage,
    // ListPage,
    // SoldItemsPage,
    // MapPage,
    // SettingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Camera,
    Network,
    CallNumber,
    AngularFireService,
    GmapService,
    DbService,
    AppService,
    AuthService,
    CameraService,
    GoogleMaps,
    LocalService
  ]
})
export class AppModule {}

/*
1. install angularfire2
$ npm install firebase angularfire2 --save

2. install firebase
$ npm install firebase firebase --save

3. install to fix Error: ./~/firebase/app/shared_promise.js
$ npm install promise-polyfill --save-exact

4. install callNumber
$ ionic cordova plugin add call-number
$ npm install --save @ionic-native/call-number

5. Install Networking:
$ ionic cordova plugin add cordova-plugin-network-information
$ npm install --save @ionic-native/network

 */
