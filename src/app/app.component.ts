import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

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

  constructor(public platform: Platform) {
    this._initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Foods', component: FoodListPage, icon: 'nutrition' }
    ];

  }

  private _initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  public openPage(page: IPageLink) {
    this._nav.setRoot(page.component);
  }
}
