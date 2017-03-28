// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Pages
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

// Providers
import { AlertService, AuthValidator } from '../../providers';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  public forgotPasswordPage: any;
  public email: AbstractControl;
  public loginForm: FormGroup;
  public password: AbstractControl;
  public signupPage: any;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _user: User
  ) {

    this.loginForm = _fb.group({
      'email': [
        '',
        Validators.compose([Validators.required, AuthValidator.emailValidator,
        AuthValidator.noWhiteSpace])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16),
        AuthValidator.passwordValidator, AuthValidator.noWhiteSpace])
      ]
    });

    this.forgotPasswordPage = ForgotPasswordPage;
    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
    this.signupPage = SignupPage;
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
          this._alertSvc.showAlert(AuthValidator.getErrorMessage(e, err));
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
