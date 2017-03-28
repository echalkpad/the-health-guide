// App
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Deploy } from '@ionic/cloud-angular';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
  HomePage,
  FoodListPage,
  RegistrationPage
} from '../pages';

export interface IPageLink {
  title: string,
  component: any,
  icon: string
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) private _nav: Nav;
  public pages: Array<IPageLink>;
  public rootPage: any = RegistrationPage;

  constructor(private _deploy: Deploy, private _platform: Platform, private _statusBar: StatusBar, private _splashScreen: SplashScreen) {
    this._initializeApp();
    //this._checkUpdate();

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Foods', component: FoodListPage, icon: 'nutrition' }
    ];

  }

  private _checkUpdate(): void {
    this._deploy.channel = 'dev';
    this._deploy.check().then((snapshotAvailable: boolean) => {
      if (snapshotAvailable) {
        /**
         * If a new snapshot is available,
         * download it, apply it, and reload the app
         */
        this._deploy.download().then(() => this._deploy.extract()).then(() => this._deploy.load());
      }
    });
  }

  private _initializeApp() {
    this._platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this._statusBar.styleDefault();
      this._splashScreen.hide();
    });
  }

  public openPage(page: IPageLink) {
    this._nav.setRoot(page.component);
  }
}
