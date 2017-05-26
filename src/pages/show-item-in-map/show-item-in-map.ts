import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GmapService } from '../../services/gmap.service';
import { iPosition } from '../../interfaces/position.interface';
@IonicPage()
@Component({
  selector: 'page-show-item-in-map',
  templateUrl: 'show-item-in-map.html',
})
export class ShowItemInMapPage {
  @ViewChild('iteminmap') mapElement: ElementRef;
  map: any;
  position: iPosition;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private gmapService: GmapService ) {
    this.position = this.navParams.get('data').POSITION;
    console.log(this.position);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowItemInMapPage');
    this.showMap(this.position);
  }

  showMap(position: iPosition) {
    let mapOptions = {
      center: position,
      zoom: 15
    }
    this.gmapService.initMap(this.mapElement.nativeElement, mapOptions)
    .then((map)=>{
      this.map = map;
    })
    .then(()=>{
      this.gmapService.addMarkerToMap(this.map, position);
    })
  }

}


/*
input: { key: string, data: iSoldItem }
*/