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
    /**
     * this.deploy.check().then((snapshotAvailable: boolean) => {
    if (snapshotAvailable) {

        let alert = this.alertCtrl.create({
            title: 'There is an update to Awesome App',
            message: 'Do you want to update?',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }, {
                text: 'Update',
                handler: () => {

                    let updateMe = true;

                    let toast = this.toastCtrl.create({
                        message: 'Downloading .. 0%',
                        position: 'bottom',
                        showCloseButton: true,
                        closeButtonText: 'Cancel'
                    });

                    toast.onDidDismiss(() => {
                        updateMe = false;
                    });

                    toast.present();

                    // this.deploy.channel = 'production';
                    this.deploy
                        .download({
                            onProgress: p => {
                                toast.setMessage('Downloading .. ' + p + '%');
                                console.log('Downloading = ' + p + '%');
                            }
                        })
                        .then(() => {

                            if (updateMe) {
                                this.deploy
                                    .extract({
                                        onProgress: p => {
                                            toast.setMessage('Extracting .. ' + p + '%');
                                            console.log('Extracting = ' + p + '%');
                                        }
                                    })
                                    .then(() => {
                                        if (updateMe) {
                                            return this.deploy.load();
                                        }
                                    })
                                    .catch(() => toast.setMessage('Uhh ohh, network problem!'))
                            }

                        })
                        .catch(() => toast.setMessage('Uhh ohh, network problem!'))
                }
            }]
        });
        alert.present();
        // When snapshotAvailable is true, you can apply the snapshot

    }
});
     */
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
