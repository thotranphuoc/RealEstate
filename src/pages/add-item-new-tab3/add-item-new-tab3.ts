import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { GmapService } from '../../services/gmap.service';

import { iPosition } from '../../interfaces/position.interface';
import { iSoldItem } from '../../interfaces/sold-item.interface';
declare var google;
@IonicPage()
@Component({
  selector: 'page-add-item-new-tab3',
  templateUrl: 'add-item-new-tab3.html',
})
export class AddItemNewTab3Page {
  loading: any;
  action: string = 'add-new';
  position: iPosition = null;
  soldItem: iSoldItem = null;
  // LOCATION tab
  mapNewItem: any;
  userMarker: any;
  mapElement: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private dbService: DbService,
    private localService: LocalService,
    private gmapService: GmapService,
    private geolocation: Geolocation, ) {
      this.action = this.localService.getItemAction();
      console.log(this.action);
      if(this.action==='item-update'){
        this.soldItem = this.dbService.getSoldItem();
        this.position = this.soldItem.POSITION;
        this.localService.setIsUserChosenPositionSet(true);
      }
      // this.initPage();
      this.loading = this.loadingCtrl.create({
        content: 'Please wait....',
        spinner: 'crescent'
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab3Page');
  }

  ionViewWillEnter() {
    this.initPage();
  }


  initPage() {
    setTimeout(() => {
      this.mapElement = document.getElementById('mapNewItem');
      this.initMap(this.mapElement);
    }, 1000)
  }

  initMap(mapElement) {
    this.startLoading()
    if (this.localService.getIsUserChosenPositionSet()) {
      console.log('user location set');
      console.log(this.dbService.soldItem.POSITION)
      this.showMap(this.dbService.soldItem.POSITION, mapElement);
    } else {
      console.log('user location not set yet');
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let pos: iPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.showMap(pos, mapElement);
          this.dbService.soldItem.POSITION = pos;
        })
    }
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
        this.hideLoading();
        console.log(map);
        this.mapNewItem = map;
        this.gmapService.addMarkerToMap(this.mapNewItem, position).then((marker) => {
          this.userMarker = marker;
        })
        google.maps.event.addListener(this.mapNewItem, 'click', (event) => {
          this.userMarker.setMap(null);
          let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(positionClick);
          this.userMarker = new google.maps.Marker({
            position: positionClick,
            map: this.mapNewItem
          })
          this.setUserChoosenPosition(positionClick);
        })
      });
  }

  setUserChoosenPosition(position: iPosition) {
    this.dbService.soldItem.POSITION = position;
    // this.soldItem.POSITION = position;
    this.dbService.isUserChosenPositionSet = true;
  }

  // LOADING
  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 20000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  // private hideLoadingWithMessage(message: string) {
  //   this.loading.dismiss();
  //   this.appService.alertMsg('Alert', message);
  //   this.navCtrl.setRoot('MapPage');
  // }

}
