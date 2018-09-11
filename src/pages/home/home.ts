// core stuff
import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { BeaconModel } from '../../app/beacon-module';
import { BeaconProvider } from '../../app/beacon-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beacons: BeaconModel[] = [];
  zone: any;

  constructor(public navCtrl: NavController,
    public platform: Platform, public beaconProvider: BeaconProvider, public events: Events) {
    // required for UI update
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.beaconProvider.initialise().then((isInitialised) => {
        if (isInitialised) {
          this.listenToBeaconEvents();
        }
      });
    });
  }

  listenToBeaconEvents() 
  {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => 
    {
      // update the UI with the beacon list
      this.zone.run(() => {
        this.beacons = [];
        let beaconList = data.beacons;
        beaconList.forEach((beacon) => {
          // alert(JSON.stringify(data));
          let beaconObject = new BeaconModel(beacon);
          this.beacons.push(beaconObject);
        });
      });
    });
  }

}