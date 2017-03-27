import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from 'ionic-angular';

@Injectable()
export class AlertService {

  constructor(private _alertCtrl: AlertController) {}

  public showAlert(message: string): void {
    let alertOpts: AlertOptions = {
      title: 'Ooops!',
      subTitle: 'Something went wrong',
      message: message,
      buttons: ['OK']
    };

    this._alertCtrl.create(alertOpts).present();
  }

}
