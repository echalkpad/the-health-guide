// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { 
  Auth,
  //FacebookAuth,
  //GoogleAuth,
  IDetailedError,
  User,
  UserDetails
} from '@ionic/cloud-angular';

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
    //private _fbAuth: FacebookAuth,
    //private _googleAuth: GoogleAuth,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _user: User
  ) { }

  /*
  // Issue
  // Unable to login to social account
  public fbAuth(): void {
    this._fbAuth.login().then(() => this._navCtrl.setRoot(HomePage));
  }

  // Bug in browser
  // No proxy found for Google Plus
  public googleAuth(): void {
    this._googleAuth.login().then(() => this._navCtrl.setRoot(HomePage));
  }

  */

  public login(): void {
    let details: UserDetails = { 'email': 'razvan.tomegea@outlook.com', 'password': 'parolaaceastanutrebuiesaouit94' };
    this._auth.login('basic', details).then(() => this._navCtrl.setRoot(HomePage));
  }

  public signup(): void {
    let details: UserDetails = { 'email': 'razvan.tomegea@outlook.com', 'password': 'parolaaceastanutrebuiesaouit94' };

    this._auth.signup(details).then(() => {
      console.log('Account success');
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
