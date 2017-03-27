// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Vendor
import { Md5 } from 'ts-md5/dist/md5';

// Pages
import { HomePage } from '../home/home';

// Providers
import { AlertService, CustomValidationService } from '../../providers';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPage {
  public email: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public password: AbstractControl;
  public signupForm: FormGroup;
  public username: AbstractControl;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _user: User
  ) {

    this.signupForm = _fb.group({
      'email': [
        '',
        Validators.compose([Validators.required, CustomValidationService.emailValidator,
        CustomValidationService.noEmptyWhiteSpace])
      ],
      'firstName': [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20),
        CustomValidationService.noEmptyWhiteSpace])
      ],
      'lastName': [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20),
        CustomValidationService.noEmptyWhiteSpace])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16),
        CustomValidationService.passwordValidator, CustomValidationService.noEmptyWhiteSpace])
      ],
      'username': [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20),
        CustomValidationService.usernameValidator, CustomValidationService.noEmptyWhiteSpace])
      ],
    });

    this.email = this.signupForm.controls['email'];
    this.firstName = this.signupForm.controls['firstName'];
    this.lastName = this.signupForm.controls['lastName'];
    this.password = this.signupForm.controls['password'];
    this.username = this.signupForm.controls['username'];

  }

  public signup(form: any): void {
    let details: UserDetails = {
      'custom': {
        'firstName': form.firstName,
        'lastName': form.lastName
      },
      'email': form.email.trim(),
      'image': 'https://www.gravatar.com/avatar/' + Md5.hashStr(form.email.trim()),
      'name': `${form.firstName.trim()} ${form.lastName.trim()}`,
      'password': form.password.trim(),
      'username': form.username.trim()
    };

    this._auth.signup(details)
      .then(() => {
        this._auth.login('basic', details)
          .then(() => this._navCtrl.setRoot(HomePage))
          .catch((err: IDetailedError<Array<string>>) => {
            for (let e of err.details) {
              this._alertSvc.showAlert(CustomValidationService.getErrorMessage(e, err));
            }
          });
      })
      .catch((err: IDetailedError<Array<string>>) => {
        for (let e of err.details) {
          this._alertSvc.showAlert(CustomValidationService.getErrorMessage(e, err));
        }
      });
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
