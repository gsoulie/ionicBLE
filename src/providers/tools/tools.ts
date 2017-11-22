import { Injectable } from '@angular/core';
import { Gatt } from '../../models/gatt';
import { Storage } from "@ionic/storage";

@Injectable()
export class ToolsProvider {

  dataset: any[] = [];
  base64;

  constructor(
    private gatt: Gatt) {
    
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

  /**
   * Convert hex value to ASCII
   * @param hexx 
   */
  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
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
  
}
