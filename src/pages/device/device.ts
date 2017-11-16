import { ToolsProvider } from './../../providers/tools/tools';
import { Component, OnInit  } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BLE } from '@ionic-native/BLE';
import {Buffer} from 'buffer';
import { Gatt } from '../../models/gatt';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage implements OnInit {
  device: any = {};
  dataset = [];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public ble: BLE, 
    private gatt: Gatt,
    public loadingCtrl: LoadingController,
    private tools: ToolsProvider) {

    this.device = this.navParams.get('device');
  }
  
  ngOnInit(){
    this.onConnect();
  }

  /**
   * Connect to current device
   * 
   * BLE.connect(device).subscribe(
        peripheralData => {
          console.log("Connect:" + JSON.stringify(peripheralData));
            BLE.startNotification(device, '180D', '2A37').subscribe(function (notificationData){
              console.log("Notification:"+ String.fromCharCode.apply(null, new Uint8Array(notificationData)));
              BLE.read(device, '180D', '2A37').then(function (data){
                //console.log("READ:" + String.fromCharCode.apply(null, new Uint8Array(data)));
                var data = new Uint8Array(buffer);
                console.log(String.fromCharCode.apply(null,data));
              }, function(error) {
                console.log("Error Read" + JSON.stringify(error));
              });
            }, function(error){
              console.log("Error Notification" + JSON.stringify(error));
            });
          },
      error => console.log("Error Connecting" + JSON.stringify(error))
      );
   */
  onConnect(){
    var loader = this.loadingCtrl.create({
      content: "Connecting..."
    });
    loader.present();
    this.ble.connect(this.device.id)
    .subscribe(
      (peripheralData) => {
        loader.onDidDismiss(()=>{
          this.dataset = this.tools.onParseCharacteristics(peripheralData.characteristics);
        });
        loader.dismiss();
      },
      (err) => {
        loader.dismiss();
        alert("connection failed " + JSON.stringify(err));
        this.navCtrl.popToRoot();
      },
      () => {
        loader.dismiss();
        alert("state undefined");
    });
  }

  onExpandCollapseService(item){
    item.expand = !item.expand;
  }

  /**
   * Read characteristic info
   * @param deviceID 
   * @param service 
   * @param characteristic (objet characteristic)
   */
  onReadCharacteristic(service,characteristic) {
    
    this.ble.read(this.device.id,service,characteristic.characteristic).then(
      function(buffer){
        var databuffer = new Uint8Array(buffer);
        switch(characteristic.type){
          case 'string':
            characteristic.value = String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            break;
          case 'number':
            characteristic.value = databuffer[0]+characteristic.unit;
            break;
          default:
            characteristic.value = JSON.stringify(databuffer)+characteristic.unit;
            break;
        }        
      }
    );
  }

  /**
   * TODO : chercher l'index du service et de la characteristique pour pouvoir mettre à jour la value lors d'une  modification
   * @param event 
   */
  onTemperatureSwitchChange(event){
    var value = new Uint8Array(1);
    value[0] = 0x01;
    this.onWriteCharacteristic("F000AA00-0451-4000-B000-000000000000","F000AA02-0451-4000-B000-000000000000",value.buffer);

    // register notification
    this.ble.startNotification(this.device.id, "F000AA00-0451-4000-B000-000000000000", "F000AA02-0451-4000-B000-000000000000")
    .subscribe(data => {
      var parsingData = new Uint8Array(data);
      var ret = '';
      for (var i = 0; i < 20; i++) {
        ret = ret + data[i] + ',';
      }
      
      alert('0x'+ret);
    },
    
    () => {
      alert("Undefined state");
    });
  }

  /**
   * Write on characteristic
   * @param service 
   * @param characteristic 
   * @param value 
   */
  onWriteCharacteristic(service, characteristic, value){
    this.ble.write(this.device.id,service,characteristic,value).then(
      function(res){
         alert("Ecriture : " + JSON.stringify(res));
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePage');
  }

  ionViewDidLeave(){
    this.ble.disconnect(this.device.id);
  }

}