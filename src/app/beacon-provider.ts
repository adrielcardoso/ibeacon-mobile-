import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';

@Injectable()
export class BeaconProvider {
    delegate: any;
    region: any;

    constructor(public platform: Platform, public events: Events, public beacon: IBeacon) { }

    initialise(): Promise<any> {
        return new Promise((resolve, reject) => {
            // we need to be running on a device
            if (this.platform.is('cordova')) {

                // Request permission to use location on iOS
                this.beacon.requestAlwaysAuthorization();

                this.beacon.isAdvertisingAvailable().then(suporte => {
                    alert("Suporte " + suporte);
                }).catch(e => {
                    alert("e " + JSON.stringify(e));
                });

                // create a new delegate and register it with the native layer
                this.delegate = this.beacon.Delegate();

                // Subscribe to some of the delegate's event handlers
                this.delegate.didRangeBeaconsInRegion()
                    .subscribe(
                        data => {
                            this.events.publish('didRangeBeaconsInRegion', data);
                        },
                        error => console.error()
                    );

                // setup a beacon region – CHANGE THIS TO YOUR OWN UUID
                this.region = this.beacon.BeaconRegion('deskBeacon', 'C56A4180-65AA-42EC-A945-5FD21DEC0538');

                // start ranging
                this.beacon.startRangingBeaconsInRegion(this.region)
                    .then(
                        () => {
                            resolve(true);
                        },
                        error => {
                            console.error('Failed to begin monitoring: ', error);
                            resolve(false);
                        }
                    );
            } else {
                // console.error(“This application needs to be running on a device”);
                resolve(false);
            }
        });
    }
}