import { TestPage } from './../test/test';
import { ToolsProvider } from './../../providers/tools/tools';
import { DevicePage } from './../device/device';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/BLE';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devices: any[] = [];
  message: string = "";
  scanButtonTitle: string = "START SCANNING";
  isScanning: boolean = false;
  characteristics: any[] = [];
  
  constructor(public navCtrl: NavController,
              private ble: BLE,
              private tools: ToolsProvider) {
                
  }

  onScan(refresher = null){
    //TODO : test si bluetooth activé
    this.isScanning = !this.isScanning;
    this.scanButtonTitle = this.isScanning == true ? "STOP" : "START SCANNING";
    this.message = "";
    this.devices = [];

    if(this.isScanning){
      this.methodeScan3();
      if(refresher){refresher.complete();}
    } else {
      this.ble.stopScan();
      if(refresher){refresher.complete();}
      this.message = "";
    }    
  }

  methodeScan3(){
    this.message = "scanning...";
      this.ble.startScan([]).subscribe(device => {
          this.devices.push(device);
      });
      setTimeout(() => {
        this.ble.stopScan().then(() => {
          this.message = "";
          this.scanButtonTitle = "START SCANNING";
          this.isScanning = false;
         
        });
      }, 10000);
  }

  connectToDevice(device){
    this.navCtrl.push(DevicePage,{device: device});               
  }

  onDisplayDetail(detail){
    var adData = new Uint8Array(detail.advertising)
    
    alert(
    this.tools.bytesToString(detail.advertising)+
    "\r\n" + this.tools.bytesToString(adData) + 
    "\r\n"+adData);
  }

  onRead(o){
    /*let res = this.tools.parseAdvertisementData(o);
    alert(JSON.stringify(res));*/
  }

}