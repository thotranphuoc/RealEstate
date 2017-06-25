import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { DbService } from '../../services/db.service';
import { GmapService } from '../../services/gmap.service';
import { iPosition } from '../../interfaces/position.interface';

declare var google;
@IonicPage()
@Component({
  selector: 'page-add-item-new-tab3',
  templateUrl: 'add-item-new-tab3.html',
})
export class AddItemNewTab3Page {

  // LOCATION tab
  mapNewItem: any;
  userMarker: any;
  mapElement: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private gmapService: GmapService,
    private geolocation: Geolocation,) {
      // this.initPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemNewTab3Page');
  }

  ionViewWillEnter(){
    this.initPage();
  }


  initPage(){
    setTimeout(() => {
      this.mapElement = document.getElementById('mapNewItem');
      this.initMap(this.mapElement);
    }, 1000)
  }

  initMap(mapElement) {
    if (this.dbService.isUserChosenPositionSet) {
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
        console.log(map);
        this.mapNewItem = map;
        this.gmapService.addMarkerToMap(this.mapNewItem, position).then((marker) => {
          this.userMarker = marker;
        })
        google.maps.event.addListener(this.mapNewItem, 'click', (event) => {
          this.userMarker.setMap(null);
          let position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(position);
          this.userMarker = new google.maps.Marker({
            position: position,
            map: this.mapNewItem
          })
          this.setUserChoosenPosition(position);
        })
      });
  }

  setUserChoosenPosition(position: iPosition) {
    this.dbService.soldItem.POSITION = position;
    // this.soldItem.POSITION = position;
    this.dbService.isUserChosenPositionSet = true;
  }

}
