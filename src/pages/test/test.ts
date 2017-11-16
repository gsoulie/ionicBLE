import { ToolsProvider } from './../../providers/tools/tools';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BLE } from '@ionic-native/BLE';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage implements OnInit{
  result;
  device: any = {};
  dataset: any[] = [];
  dataset2: any[] = [
    {
       "service":"1800",
       "name":"Generic Access",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"2a00",
             "name":"Device Name",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"1800",
             "value":""
          },
          {
             "characteristic":"2a01",
             "name":"Appearance",
             "properties":[
                "Read"
             ],
             "type":"number",
             "unit":"",
             "service":"1800",
             "value":""
          },
          {
             "characteristic":"2a04",
             "name":"Peripheral Preferred Connection Parameters",
             "properties":[
                "Read"
             ],
             "type":"number",
             "unit":"",
             "service":"1800",
             "value":""
          }
       ]
    },
    {
       "service":"180a",
       "name":"Device Information",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"2a23",
             "name":"System ID",
             "properties":[
                "Read"
             ],
             "type":"number",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a24",
             "name":"Model Number",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a25",
             "name":"Serial Number",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a26",
             "name":"Firmware Revision",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a27",
             "name":"Hardware Revision",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a28",
             "name":"Software Revision",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a29",
             "name":"Manufacturer Name",
             "properties":[
                "Read"
             ],
             "type":"string",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a2a",
             "name":"IEEE 11073-20601 Regulatory Certification Data List",
             "properties":[
                "Read"
             ],
             "type":"complex",
             "unit":"",
             "service":"180a",
             "value":""
          },
          {
             "characteristic":"2a50",
             "name":"PnP ID",
             "properties":[
                "Read"
             ],
             "type":"complex",
             "unit":"",
             "service":"180a",
             "value":""
          }
       ]
    },
    {
       "service":"180f",
       "name":"Battery Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"2a19",
             "name":"Battery Level",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"number",
             "unit":"",
             "service":"180f",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa00-0451-4000-b000-000000000000",
       "name":"IR Temperature Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa01-0451-4000-b000-000000000000",
             "name":"IR Temperature Data",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa00-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa02-0451-4000-b000-000000000000",
             "name":"IR Temperature Config",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa00-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa03-0451-4000-b000-000000000000",
             "name":"IR Temperature Period",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"ms",
             "service":"f000aa00-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa20-0451-4000-b000-000000000000",
       "name":"Humidity Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa21-0451-4000-b000-000000000000",
             "name":"Humidity Data",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa20-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa22-0451-4000-b000-000000000000",
             "name":"Humidity Config",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa20-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa23-0451-4000-b000-000000000000",
             "name":"Humidity Period",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa20-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa40-0451-4000-b000-000000000000",
       "name":"Barometer Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa41-0451-4000-b000-000000000000",
             "name":"Barometer Data",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa40-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa42-0451-4000-b000-000000000000",
             "name":"Barometer Config",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa40-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa44-0451-4000-b000-000000000000",
             "name":"Barometer Period",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa40-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa80-0451-4000-b000-000000000000",
       "name":"Movement Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa81-0451-4000-b000-000000000000",
             "name":"Movement Data",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa80-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa82-0451-4000-b000-000000000000",
             "name":"Movement Config",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa80-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa83-0451-4000-b000-000000000000",
             "name":"Movement Period",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa80-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa70-0451-4000-b000-000000000000",
       "name":"Luxometer Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa71-0451-4000-b000-000000000000",
             "name":"Luxometer Data",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa70-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa72-0451-4000-b000-000000000000",
             "name":"Luxometer Config",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa70-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa73-0451-4000-b000-000000000000",
             "name":"Luxometer Period",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa70-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"ffe0",
       "name":"Simple Keys Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"ffe1",
             "name":"Key press state",
             "properties":[
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"ffe0",
             "value":""
          }
       ]
    },
    {
       "service":"f000aa64-0451-4000-b000-000000000000",
       "name":"IO Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000aa65-0451-4000-b000-000000000000",
             "name":"IO Data",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa64-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000aa66-0451-4000-b000-000000000000",
             "name":"IO Config (0:local 1:remote 2:test)",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000aa64-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000ac00-0451-4000-b000-000000000000",
       "name":"Register Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000ac01-0451-4000-b000-000000000000",
             "name":"Register Data",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ac00-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ac02-0451-4000-b000-000000000000",
             "name":"Register Address",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ac00-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ac03-0451-4000-b000-000000000000",
             "name":"Register Device ID",
             "properties":[
                "Read",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ac00-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000ccc0-0451-4000-b000-000000000000",
       "name":"Connection Control Service",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000ccc1-0451-4000-b000-000000000000",
             "name":"Connection Parameters (ConnInterval,SlaveLatency,SupervisionTimeout [2 bytes each])",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ccc0-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ccc2-0451-4000-b000-000000000000",
             "name":"Request Connection Params",
             "properties":[
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ccc0-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ccc3-0451-4000-b000-000000000000",
             "name":"Disconnect Request",
             "properties":[
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ccc0-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    },
    {
       "service":"f000ffc0-0451-4000-b000-000000000000",
       "name":"f000ffc0-0451-4000-b000-000000000000",
       "expand":false,
       "characteristics":[
          {
             "characteristic":"f000ffc1-0451-4000-b000-000000000000",
             "name":"0xf000ffc1-0451-4000-b000-000000000000",
             "properties":[
                "WriteWithoutResponse",
                "Write",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ffc0-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ffc2-0451-4000-b000-000000000000",
             "name":"0xf000ffc2-0451-4000-b000-000000000000",
             "properties":[
                "WriteWithoutResponse",
                "Write",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ffc0-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ffc3-0451-4000-b000-000000000000",
             "name":"0xf000ffc3-0451-4000-b000-000000000000",
             "properties":[
                "WriteWithoutResponse",
                "Write"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ffc0-0451-4000-b000-000000000000",
             "value":""
          },
          {
             "characteristic":"f000ffc4-0451-4000-b000-000000000000",
             "name":"0xf000ffc4-0451-4000-b000-000000000000",
             "properties":[
                "Read",
                "Notify"
             ],
             "type":"complex",
             "unit":"",
             "service":"f000ffc0-0451-4000-b000-000000000000",
             "value":""
          }
       ]
    }
 ];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private tools: ToolsProvider, 
    private ble: BLE,
    public loadingCtrl: LoadingController) {
    //this.result = JSON.stringify(this.navParams.get('characteristics'));
   // this.dataset = this.tools.onGetCharacteristics();
   this.device = this.navParams.get("device");
   
  }

  ngOnInit(){
    this.onConnect();
  }

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
        alert("connection failed " + err);
      },
      () => {
        loader.dismiss();
        alert("state undefined");
      });

  }

  onReadCharacteristic(service,characteristic) {
    this.ble.read(this.device.id,service,characteristic.characteristic).then(
      function(buffer){
        var databuffer = new Uint8Array(buffer);
       
        switch(characteristic.type){
          case 'string':
            //alert("value = " + String.fromCharCode.apply(null,databuffer)+characteristic.unit);
            characteristic.value = String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            //this.dataset[indexService].charac[indexCharacteristic].value = String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            //return String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            break;
          case 'number':
            //alert("value = " + databuffer[0]+characteristic.unit);
            //this.dataset[indexService].charac[indexCharacteristic].value = String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            //return databuffer[0]+characteristic.unit;
            characteristic.value = databuffer[0]+characteristic.unit;
            break;
          default:
            //alert(characteristic.characteristic+"\r\nvalue = " + JSON.stringify(databuffer)+characteristic.unit+"\r\n"+ databuffer[0]+characteristic.unit+"\r\n"+ databuffer);
            //this.dataset[indexService].charac[indexCharacteristic].value = String.fromCharCode.apply(null,databuffer)+characteristic.unit;
            //return JSON.stringify(databuffer)+characteristic.unit;
            characteristic.value = JSON.stringify(databuffer)+characteristic.unit;
            break;
        }
        
      }
    );
  }

  onExpandCollapseService(item){
    item.expand = !item.expand;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}
