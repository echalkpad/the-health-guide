// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

// Pages
import { PasswordResetPage } from '../password-reset/password-reset';

// Providers
import { AlertService, CustomValidationService } from '../../providers';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPage {
  public forgotPasswordForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public pswResetPage: any;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _navCtrl: NavController
  ) {

    this.forgotPasswordForm = _fb.group({
      'email': [
        '',
        Validators.compose([Validators.required, CustomValidationService.emailValidator,
        CustomValidationService.noEmptyWhiteSpace])
      ]
    });

    this.email = this.forgotPasswordForm.controls['email'];
    this.pswResetPage = PasswordResetPage;
  }

  public reqestReset(form: any): void {
    this._auth.requestPasswordReset(form.email)
      .then(() => this._navCtrl.setRoot(PasswordResetPage, { email: form.email }))
      .catch((err: Error) => this._alertSvc.showAlert(err.toString()));
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}