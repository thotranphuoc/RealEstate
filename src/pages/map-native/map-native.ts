import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-map-native',
  templateUrl: 'map-native.html',
})
export class MapNativePage {

  constructor(
    private googleMaps: GoogleMaps,
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform) {
    platform.ready().then(() => {
      // let mapnative = new GoogleMap('mapnative');
      this.loadMap();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapNativePage');
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('mapnative');
    let map: GoogleMap = this.googleMaps.create(element);

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('map is ready');
    })

    // create LatLng object
    let ionic: LatLng = new LatLng(43.0741904, -89.3809802);

    // create CameraPosition
    let position: CameraPosition = {
      target: ionic,
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position
    map.moveCamera(position);

    // create new marker
    let markerOptions: MarkerOptions = {
      position: ionic,
      title: 'Ionic'
    };

    let marker = map.addMarker(markerOptions)
      .then((marker: Marker) => {
        marker.showInfoWindow();
      });

  }

}
