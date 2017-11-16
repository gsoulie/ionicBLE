import { Injectable } from '@angular/core';
import { Gatt } from '../../models/gatt';
import { Storage } from "@ionic/storage";
import { BLE } from '@ionic-native/BLE';

@Injectable()
export class ToolsProvider {

  dataset: any[] = [];
  base64;

  constructor(
    private gatt: Gatt, 
    private ble: BLE,) {
    
  }

   /**
   * Order characteristics by services and parse the values to display more informations
   */
  onParseCharacteristics(characteristics: any[] = []){
    var service = "",
    charac = [],
    dataset = [];

    for(var i = 0; i < characteristics.length; i++){
      if(i == 0){
        service = characteristics[i].service;
      } else {
        if(service !== characteristics[i].service){
          dataset.push({service: service, name: this.gatt.getServiceName(service), expand: false, characteristics: charac});
          service = characteristics[i].service;
          charac = [];
        }
      }
      charac.push({characteristic: characteristics[i].characteristic, 
                  name:this.gatt.getCharacteristicName(characteristics[i].characteristic), 
                  properties: characteristics[i].properties,
                  type: this.gatt.getCharacteristicType(characteristics[i].characteristic),
                  unit: this.gatt.getCharacteristicUnit(characteristics[i].characteristic),
                  service: service,
                  value:''});
    }

    dataset.push({service: service, name: service, expand: false, characteristics: charac});
    
    return dataset;
  }

  // ASCII only
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }
  
  // ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

/*
  parseAdvertisementData(device)
  {
   // if (!this.base64) { this.base64 = cordova.require('cordova/base64'); }
    // Here we parse BLE/GAP Scan Response Data.
    // See the Bluetooth Specification, v4.0, Volume 3, Part C, Section 11,
    // for details.
  
    var byteArray = this.base64DecToArr(device.scanRecord);
    var pos = 0;
    var advertisementData = {
      kCBAdvDataLocalName:"",
      kCBAdvDataTxPowerLevel:"",
      kCBAdvDataManufacturerData:"",
      kCBAdvDataServiceUUIDs:"",
      kCBAdvDataServiceData:""
    };
    var serviceUUIDs;
    var serviceData;
  
    // The scan record is a list of structures.
    // Each structure has a length byte, a type byte, and (length-1) data bytes.
    // The format of the data bytes depends on the type.
    // Malformed scanRecords will likely cause an exception in this function.
    while (pos < byteArray.length)
    {
      var length = byteArray[pos++];
      if (length == 0)
      {
        break;
      }
      length -= 1;
      var type = byteArray[pos++];
  
      // Parse types we know and care about.
      // Skip other types.
  
      var BLUETOOTH_BASE_UUID = '-0000-1000-8000-00805f9b34fb'
  
      // Convert 16-byte Uint8Array to RFC-4122-formatted UUID.
      
  
      if (type == 0x02 || type == 0x03) // 16-bit Service Class UUIDs.
      {
        serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
        for(var i=0; i<length; i+=2)
        {
          serviceUUIDs.push(
            '0000' +
            this.toHexString(
              this.littleEndianToUint16(byteArray, pos + i),
              2) +
            BLUETOOTH_BASE_UUID);
        }
      }
      if (type == 0x04 || type == 0x05) // 32-bit Service Class UUIDs.
      {
        serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
        for (var x=0; x<length; x+=4)
        {
          serviceUUIDs.push(
            this.toHexString(
              this.littleEndianToUint32(byteArray, pos + x),
              4) +
            BLUETOOTH_BASE_UUID);
        }
      }
      if (type == 0x06 || type == 0x07) // 128-bit Service Class UUIDs.
      {
        serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
        for (var y=0; y<length; y+=16)
        {
          serviceUUIDs.push(this.arrayToUUID(byteArray, pos + y));
        }
      }
      if (type == 0x08 || type == 0x09) // Local Name.
      {
       
        advertisementData.kCBAdvDataLocalName = this.ble.fromUtf8(
          new Uint8Array(byteArray.buffer, pos, length));
      }
      if (type == 0x0a) // TX Power Level.
      {
        advertisementData.kCBAdvDataTxPowerLevel =
        this.littleEndianToInt8(byteArray, pos);
      }
      if (type == 0x16) // Service Data, 16-bit UUID.
      {
        serviceData = serviceData ? serviceData : {};
        var uuid =
          '0000' +
          this.toHexString(
            this.littleEndianToUint16(byteArray, pos),
            2) +
          BLUETOOTH_BASE_UUID;
        var data = new Uint8Array(byteArray.buffer, pos+2, length-2);
        serviceData[uuid] = btoa(this.fromArrayBuffer(data));
      }
      if (type == 0x20) // Service Data, 32-bit UUID.
      {
        serviceData = serviceData ? serviceData : {};
        let uuid =
          this.toHexString(
            this.littleEndianToUint32(byteArray, pos),
            4) +
          BLUETOOTH_BASE_UUID;
        let data = new Uint8Array(byteArray.buffer, pos+4, length-4);
        serviceData[uuid] = btoa(this.fromArrayBuffer(data));
      }
      if (type == 0x21) // Service Data, 128-bit UUID.
      {
        serviceData = serviceData ? serviceData : {};
        let uuid = this.arrayToUUID(byteArray, pos);
        let data = new Uint8Array(byteArray.buffer, pos+16, length-16);
        serviceData[uuid] = btoa(data);
      }
      if (type == 0xff) // Manufacturer-specific Data.
      {
        // Annoying to have to transform base64 back and forth,
        // but it has to be done in order to maintain the API.
       
        advertisementData.kCBAdvDataManufacturerData =
          btoa(new Uint8Array(byteArray.buffer, pos, length));
      }
  
      pos += length;
    }
    advertisementData.kCBAdvDataServiceUUIDs = serviceUUIDs;
    advertisementData.kCBAdvDataServiceData = serviceData;
    device.advertisementData = advertisementData;

    return advertisementData;
  
  }

  base64DecToArr(sBase64, nBlocksSize = 0) {
    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
    var nInLen = sB64Enc.length;
    var nOutLen = nBlocksSize ?
      Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
      : nInLen * 3 + 1 >> 2;
    var taBytes = new Uint8Array(nOutLen);
  
    for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
      nMod4 = nInIdx & 3;
      nUint24 |= this.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
          taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
        }
        nUint24 = 0;
      }
    }
  
    return taBytes;
  }

  b64ToUint6(nChr) {
    return nChr > 64 && nChr < 91 ?
        nChr - 65
      : nChr > 96 && nChr < 123 ?
        nChr - 71
      : nChr > 47 && nChr < 58 ?
        nChr + 4
      : nChr === 43 ?
        62
      : nChr === 47 ?
        63
      :
        0;
  }
  
	littleEndianToUint32(data, offset)
  {
    return (this.littleEndianToUint8(data, offset + 3) << 24) +
      (this.littleEndianToUint8(data, offset + 2) << 16) +
      (this.littleEndianToUint8(data, offset + 1) << 8) +
      this.littleEndianToUint8(data, offset)
  }

  toHexString(i, byteCount) {
    var string = (new Number(i)).toString(16);
    while(string.length < byteCount*2) {
      string = '0'+string;
    }
    return string;
  }

  littleEndianToInt8(data, offset)
  {
    var x = this.littleEndianToUint8(data, offset)
    if (x & 0x80) x = x - 256
    return x
  }

  littleEndianToUint8(data, offset)
  {
    return data[offset]
  }

  littleEndianToUint16(data, offset)
  {
    return (this.littleEndianToUint8(data, offset + 1) << 8) +
      this.littleEndianToUint8(data, offset)
  }

  arrayToUUID(array, offset)
  {
    var k=0;
    var string = '';
    var UUID_format = [4, 2, 2, 2, 6];
    for (var l=0; l<UUID_format.length; l++)
    {
      if (l != 0)
      {
        string += '-';
      }
      for (var j=0; j<UUID_format[l]; j++, k++)
      {
        string += this.toHexString(array[offset+k], 1);
      }
    }
    return string;
  }*/
  
}
