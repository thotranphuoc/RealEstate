import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
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
  map: any;
  mapEl: any;
  locations = [
    { lat: 11.563910, lng: 106.154312 },
    { lat: 13.718234, lng: 106.363181 },
    { lat: 13.727111, lng: 106.371124 },
    { lat: 13.848588, lng: 106.209834 },
    { lat: 13.851002, lng: 106.216968 },
    { lat: 10.671264, lng: 106.863657 },
    { lat: 15.304724, lng: 108.662905 },
    { lat: 16.810685, lng: 106.699196 },
    { lat: 16.828611, lng: 106.790222 },
    { lat: 10.750000, lng: 106.116667 },
    { lat: 10.759859, lng: 106.128708 },
    { lat: 10.765015, lng: 106.133858 },
    { lat: 10.770104, lng: 106.103299 },
    { lat: 10.773700, lng: 106.106187 },
    { lat: 10.774785, lng: 106.137978 },
    { lat: 10.819616, lng: 106.968119 },
    { lat: 18.330766, lng: 106.695692 },
    { lat: 19.927193, lng: 106.053218 },
    { lat: 11.330162, lng: 104.865694 },
    { lat: 12.734358, lng: 106.439506 },
    { lat: 12.734358, lng: 106.501315 },
    { lat: 12.735258, lng: 106.438000 },
    { lat: 13.999792, lng: 100.463352 }
  ];

  items: FirebaseListObservable<any[]>;
  soldItems: iSoldItem[];
  soldItemsKey: { key: string, data: iSoldItem }[] = [];
  loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
    private afDB: AngularFireDatabase) {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.startLoading();
    setTimeout(()=>{
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    },1000)
   
    
  }

  ionViewWillEnter() {
    
    console.log('ionViewWillEnter');
    this.items = this.afDB.list('/soldItems');
    this.items.subscribe((items) => {
      console.log(items);
      this.soldItemsKey =[];
      items.forEach(item => {
        let itemKey = {
          key: item.$key,
          data: item
        }
        this.soldItemsKey.push(itemKey);
      })
      console.log(this.soldItemsKey);
    })
  }

  initMap(mapElement) {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let pos: iPosition = { lat: position.coords.latitude, lng: position.coords.longitude}
        // this.loadMap(latLng);
        this.showMap(pos, mapElement)
      })
      .catch((err) => {
        console.log(err);
        alert('No gps signal');
        let latLng = new google.maps.LatLng(10.802703148181791, 106.63943767547607);
        let pos: iPosition = { lat: 10.802703148181791, lng: 106.63943767547607}
        // this.loadMap(latLng)
        this.showMap(pos, mapElement)
      })

  }

  // loadMap(latLng) {
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   // this.gmapService.loadLocationIntoMapAddListener(this.map, this.locations);
  //   google.maps.event.addListener(this.map, 'idle', () => {
  //     console.log('map was loaded fully');
  //     this.hideLoading();
  //     this.loadSoldItemsKey();
  //   })
  // }

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
        })
      })
  }

  loadSoldItemsKey() {
    this.soldItemsKey.forEach(soldItemKey => {
      // let soldItemKey = {
      //   key: 'soldItem',
      //   data: soldItem
      // }
      this.gmapService.addMarkerToMapWithID(this.map, soldItemKey);
    })
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
}


/*
1. Add Geolocation plugin. Then remember to add Geolocation into providers in app.module.ts
ionic cordova plugin add cordova-plugin-geolocation
npm install --save @ionic-native/geolocation
*/