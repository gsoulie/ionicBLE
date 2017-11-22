import { ToolsProvider } from './../../providers/tools/tools';
import { DevicePage } from './../device/device';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/BLE';
import {Buffer} from 'buffer';
declare function require(name: string);
var adv = require('advlib');

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
              private tools: ToolsProvider/*,
  private adv: advlib*/) {
    this.onScan();
  }

  onScan(refresher = null){
    
    //TODO : test si bluetooth activé
    this.isScanning = !this.isScanning;
    this.scanButtonTitle = this.isScanning == true ? "STOP" : "START SCANNING";
    this.message = "";
    this.devices = [];

    if(this.isScanning){
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
      if(refresher){refresher.complete();}
    } else {
      this.ble.stopScan();
      if(refresher){refresher.complete();}
      this.message = "";
    }    
  }

  connectToDevice(device){
    this.navCtrl.push(DevicePage,{device: device});               
  }

 
  onGetAdvertisingData(device){
    var adData = new Uint8Array(device.advertising)
    var advertisingObject = adv.ble.process(this.tools.buf2hex(adData));
    var temperature = this.convertToTemperature(advertisingObject.advData.serviceData.data);
    var batteryLevel = this.onGetBatteryLevel(advertisingObject.value);
  
    //if(advertisingObject.advData.serviceData == "1809"){
      
    var data = [
      {service: advertisingObject.advData.serviceData.specificationName, value: temperature+"°C"},
      {service: "Battery level", value: parseInt(batteryLevel[0],16) + "%"}
    ];

      device.data = data;
    //}
  }

  /**
   * Convert passed value to readable temperature value in °C
   * @param value
   */
  convertToTemperature(value){
    //var convertedData = parseInt(this.tools.convertToLittleEndian(value), 16);
    var convertedData = parseFloat(this.tools.convertToLittleEndian(value));

    return convertedData;
  }

  /**
   * Convert advertising.value in 2 bytes array (battery level is the 2 firsts bytes in the array)
   * @param value 
   */
  onGetBatteryLevel(value){
    var valeLen = value.length;
    var valueArray = [];  // contains "value" node 
    var temp = "";

    // Exploding "value" node into 16 bits array
    for(let i = 0; i < valeLen; i++){
      if(i%2 == 0 && i > 0){
        valueArray.push(temp)
        temp = "";
      }
      temp += value[i];
    }
    valueArray.push(temp);
    return valueArray;
  }
  
  onDisplayDetail(device){
    var adData = new Uint8Array(device.advertising)
    var advertisingObject = adv.ble.process(this.tools.buf2hex(adData));
    var temperature = advertisingObject.advData.serviceData.data;
    //var batterieLevel = substring(advertisingObject.value)
    var valeLen = advertisingObject.value.length;
    var valueArray = [];
    var temp = "";
    
    for(let i = 0; i < valeLen; i++){
      if(i%2 == 0 && i > 0){
        valueArray.push(temp)
        temp = "";
      }
      temp += advertisingObject.value[i];
    }
    valueArray.push(temp);
    
            
    alert(this.tools.buf2hex(adData) + "\r\n" + JSON.stringify(advertisingObject));
  }

}