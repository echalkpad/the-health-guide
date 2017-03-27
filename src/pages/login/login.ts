// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, AlertOptions, NavController } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Pages
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

// Providers
import { CustomValidationService } from '../../providers';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  public email: AbstractControl;
  public password: AbstractControl;
  public loginForm: FormGroup;
  public signupPage: any;
  constructor(
    private _alertCtrl: AlertController,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _user: User
  ) {

    this.loginForm = _fb.group({
      'email': [
        '',
        Validators.compose([Validators.required, CustomValidationService.emailValidator,
        CustomValidationService.noEmptyWhiteSpace])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16),
        CustomValidationService.passwordValidator, CustomValidationService.noEmptyWhiteSpace])
      ]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
    this.signupPage = SignupPage;
  }

  private _showAlert(message: string): void {
    let alertOpts: AlertOptions = {
      title: 'Ooops!',
      subTitle: 'Something went wrong',
      message: message,
      buttons: ['OK']
    };

    this._alertCtrl.create(alertOpts).present();
  }

  public login(form: any): void {
    let details: UserDetails = {
      'email': form.email.trim(),
      'password': form.password.trim(),
    };

    this._auth.login('basic', details)
      .then(() => this._navCtrl.setRoot(HomePage))
      .catch((err: IDetailedError<Array<string>>) => {
        for (let e of err.details) {
          this._showAlert(CustomValidationService.getErrorMessage(e, err));
        }
      });
  }

  ionViewWillEnter() {
    if (this._auth.isAuthenticated()) {
      this._navCtrl.setRoot(HomePage);
    }
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
