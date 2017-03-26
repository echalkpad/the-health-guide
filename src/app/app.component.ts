// App
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
  AuthPage,
  HomePage,
  FoodListPage
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
  public rootPage: any = AuthPage;

  constructor(private _platform: Platform, private _statusBar: StatusBar, private _splashScreen: SplashScreen) {
    this._initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Foods', component: FoodListPage, icon: 'nutrition' }
    ];

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
