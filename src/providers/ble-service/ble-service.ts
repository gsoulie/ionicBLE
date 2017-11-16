import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/BLE';

@Injectable()
export class BleServiceProvider {
  devices: any[] = [];

  constructor(private ble: BLE) {    
  }

  onBLEscanStart(){
    this.devices = [];
    
    return new Promise<any[]>((resolve) => {
      this.ble.startScan([]).subscribe(device => {
        this.devices.push(device);
      });
      setTimeout(() => {
        this.ble.stopScan().then(() => {
          resolve(this.devices);
        })
      }, 10000);
    })
  }

  onBLEscanStop(){
    return new Promise((resolve,reject) =>{
      this.ble.stopScan()
      .then(data => {
        resolve(data)
      })
      .catch(err =>{
        reject(err)
      })
    })
  }
}
