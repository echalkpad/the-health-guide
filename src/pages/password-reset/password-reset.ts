// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

// Providers
import { AlertService, AuthValidator } from '../../providers';

@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetPage {
  public email: string;
  public password: AbstractControl;
  public passwordResetForm: FormGroup;
  public resetCode: AbstractControl;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.email = _params.get('email');
    this.passwordResetForm = _fb.group({
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidator.passwordValidator, AuthValidator.noWhiteSpace])
      ],
      resetCode: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6),
        AuthValidator.noWhiteSpace])
      ]
    });

    this.password = this.passwordResetForm.get('password');
    this.resetCode = this.passwordResetForm.get('resetCode');
  }

  public backToLogin(): void {
    this._navCtrl.popToRoot();
  }

  public resetPassword(form: { resetCode: number, password: string }): void {
    let loader = this._loadCtrl.create({
      content: 'Resetting your password...',
      spinner: 'crescent'
    });

    loader.present();
    
    this._auth.confirmPasswordReset(form.resetCode, form.password)
      .then(() => {
        loader.dismiss();
        this._navCtrl.popToRoot();
      })
      .catch((err: Error) => this._alertSvc.showAlert(err.toString()));
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
