import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
import { DbService } from '../../services/db.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { iSoldItem } from '../../interfaces/sold-item.interface';
import { iPosition } from '../../interfaces/position.interface';
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  // @ViewChild('map') mapElement: ElementRef;

  mapEl: any;
  map: any;

  items: FirebaseListObservable<any[]>;
  soldItems: iSoldItem[];
  soldItemsKey: { key: string, data: iSoldItem }[] = [];
  loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
    private dbService: DbService,
    private afDB: AngularFireDatabase) {
    this.platform.ready().then(() => {
      // setTimeout(() => {
      //   this.mapEl = document.getElementById('map');
      //   this.initMap(this.mapEl)
      // }, 1000)
    })

    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)
  }

  ionViewWillEnter() {

    console.log('ionViewWillEnter');
    this.items = this.afDB.list('/soldItems');
    this.items.subscribe((items) => {
      console.log(items);
      this.soldItemsKey = [];
      items.forEach(item => {
        if (item.VISIBLE) {
          let itemKey = {
            key: item.$key,
            data: item
          }
          this.soldItemsKey.push(itemKey);
        }
      })
      console.log(this.soldItemsKey);
    })
  }

  initMap(mapElement) {
    // this.gmapService.getCurrentPosition()
    this.geolocation.getCurrentPosition()
      .then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let pos: iPosition = { lat: position.coords.latitude, lng: position.coords.longitude }
        this.gmapService.setUserCurrentPosition(pos);
        this.showMap(pos, mapElement)
      })
      .catch((err) => {
        this.gmapService.getUserCurrentPosition()
          .then((position: iPosition) => {
            console.log(position);
            this.showMap(position, mapElement)
          }, err => {
            console.log(err);
            alert('No gps signal. Your location cannot be detected now.');
            let pos: iPosition = { lat: 10.778168043677463, lng: 106.69638633728027};
            this.showMap(pos,mapElement);
          })

      })

  }

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.map = map;
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.loadSoldItemsKey();
          let bound = this.map.getBounds();
          console.log(bound);

        })
      })
  }

  loadSoldItemsKey() {
    // remove existing marker first. then load new markers later to sure that new INVISIBLE markers will be removed
    this.gmapService.removeMarkersFromMap(this.dbService.getMarkers());

    let markers = [];
    let sortItems = [];
    this.soldItemsKey.forEach(soldItemKey => {
      // console.log(this.isPositionInsideMap(soldItemKey.data.POSITION, this.map));
      if (this.isPositionInsideMap(soldItemKey.data.POSITION, this.map)) {
        this.gmapService.addMarkerToMapWithID(this.map, soldItemKey).then((marker) => {
          markers.push(marker)
        })
        sortItems.push(soldItemKey);
      }
    });
    this.dbService.setSoldItems(sortItems);

    console.log(this.dbService.getSoldItems());
    console.log(markers);
    this.dbService.setMarkers(markers);

  }

  // 
  sortListSoldItemsList(items: iPosition[]) {
    items.forEach(item => {
      // let latLng = { lat: item.lat, lng: item.lng};
      console.log(this.map.getBounds().contains(item)); // return true if latLng inside this.map
    })
  }

  isPositionInsideMap(pos: iPosition, map) {
    return map.getBounds().contains(pos);
  }

  addNew() {
    this.navCtrl.push('AddItemPage', { action: 'add-new' });
  }

  // addInfoWindow(marker, content) {

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //   });

  // }

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

  go2List() {
    console.log('go2List');
    this.navCtrl.push('ItemsPage');
  }

  addNewItem(){
    this.navCtrl.push('AddItemNewPage');
  }
}


/*
1. Add Geolocation plugin. Then remember to add Geolocation into providers in app.module.ts
ionic cordova plugin add cordova-plugin-geolocation
npm install --save @ionic-native/geolocation
*/