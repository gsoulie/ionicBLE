import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/BLE';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DevicePage } from '../pages/device/device';
import { Gatt } from '../models/gatt';
import { ToolsProvider } from '../providers/tools/tools';
import { HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TestPage } from '../pages/test/test';
import { IonicStorageModule } from '@ionic/storage';
import { BleServiceProvider } from '../providers/ble-service/ble-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DevicePage,
    TestPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DevicePage,
    TestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    Gatt,
    HttpClient,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToolsProvider,
    BleServiceProvider
  ]
})
export class AppModule {}
