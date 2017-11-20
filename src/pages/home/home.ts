import { ToolsProvider } from './../../providers/tools/tools';
import { DevicePage } from './../device/device';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/BLE';
import {Buffer} from 'buffer';
//import {advlib} from 'advlib';
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
    var advertisingObject = adv.ble.process(this.buf2hex(adData));
    var temperature = advertisingObject.advData.serviceData.data;

    //if(advertisingObject.advData.serviceData == "1809"){
      var convertedData = this.convertToLittleEndian(temperature);
      device.advertising = parseInt(convertedData, 16)+"°C";
    //}
  }

  
  onDisplayDetail(device){
    var adData = new Uint8Array(device.advertising)
    var advertisingObject = adv.ble.process(this.buf2hex(adData));
    var temperature = advertisingObject.advData.serviceData.data;
    

   /* var SCALE_LSB = 0.03125;
    var t;
    var it;
   
    it = parseInt((temperature >> 2));
    t = ((float)(it)) * SCALE_LSB;*/
   /* *tObj = t;

   
    it = (int)((rawAmbTemp) >> 2);
    t = (float)it;
    *tAmb = t * SCALE_LSB;*/


        
    alert(this.buf2hex(adData) + "\r\n" + JSON.stringify(advertisingObject));
  }

  /**
   * Convert hex value to little Endian value
   * @param buf 
   */
  convertToLittleEndian(buf){
    var v = buf;                 // input number
    var s = v.toString(16);             // translate to hexadecimal notation
    s = s.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
    var a = s.match(/../g);             // split number in groups of two
    a.reverse();                        // reverse the groups
    var s2 = a.join("");   
    return s2;
  }

  /**
   * Convert passed value to readable temperature value in °C
   * @param value
   */
  convertToTemperature(value){
    
  }

  hexToDec(hex) {
    var result = 0, digitValue;
    hex = hex.toLowerCase();
    for (var i = 0; i < hex.length; i++) {
        digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
        result = result * 16 + digitValue;
    }
    return result;
}

  /**
   * Convert buffer to hex value
   * @param buffer 
   */
  buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  onRead(o){
    
    this.ble.read(o.id,"1809","2a1c")
    .then(data =>{
      var level = String.fromCharCode.apply(null,new Uint8Array(data))
      var converted = level.charCodeAt(0);
      alert("level " + level+"\r\nconverted : " + converted);
    })
    .catch(err => {
      alert("error : " + JSON.stringify(err));
    })
  }

}