// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Auth, FacebookAuth, GoogleAuth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Pages
import { HomePage } from '../home/home';

// Providers
import { AuthService } from '../../providers';

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage {

  constructor(
    private _auth: Auth,
    private _authSvc: AuthService,
    private _detectorRef: ChangeDetectorRef,
    private _fbAuth: FacebookAuth,
    private _googleAuth: GoogleAuth,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _user: User
  ) { }

  public createAccount(): void {
    let details: UserDetails = { 'email': 'hi@ionic.io', 'password': 'puppies123' };

    this._auth.signup(details).then(() => {
      this._auth.login('basic', details).then(() => this._navCtrl.setRoot(HomePage));
    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        if (e === 'conflict_email') {
          alert('Email already exists.');
        } else {
          // handle other errors
        }
      }
    });
  }

  public fbAuth(): void {
    this._fbAuth.login().then(() => this._navCtrl.setRoot(HomePage));
  }

  public googleAuth(): void {
    this._googleAuth.login().then(() => this._navCtrl.setRoot(HomePage));
  }

  ionViewWillEnter() {
    if (this._auth.isAuthenticated()) {
      this._navCtrl.setRoot(HomePage)
    }
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
