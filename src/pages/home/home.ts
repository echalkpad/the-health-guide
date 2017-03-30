// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

// Firebase
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// Pages
import { FitnessPage } from '../fitness/fitness';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  public items: FirebaseListObservable<Array<any>>;
  constructor(
    private _af: AngularFire,
    private _alertCtrl: AlertController,
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    if (!!_params.get('new')) {
      let greetAlert = this._alertCtrl.create({
        title: 'Hi there! My name is Tommy!',
        subTitle: 'I will be your health guide and friend from know on',
        message: "Before we begin, I would like to know more about you, if you don't mind of course...",
        buttons: ['Yes! Of course']
      });

      greetAlert.present();

      greetAlert.onDidDismiss(() => this._navCtrl.setRoot(FitnessPage, { new: true }));
    }
    this.items = _af.database.list('/items');
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
