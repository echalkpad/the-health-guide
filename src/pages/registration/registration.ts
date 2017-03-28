// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Auth, IDetailedError, User, UserDetails } from '@ionic/cloud-angular';

// Vendor
import { Md5 } from 'ts-md5/dist/md5';

// Pages
import { HomePage } from '../home/home';

// Providers
import { AlertService, AuthValidator } from '../../providers';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationPage {
  public email: AbstractControl;
  public password: AbstractControl;
  public passwordConfirm: AbstractControl;
  public registerForm: FormGroup;
  public username: AbstractControl;
  constructor(
    private _alertSvc: AlertService,
    private _auth: Auth,
    private _detectorRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _user: User
  ) {
    this.registerForm = this._fb.group({
      email: [
        '',
        Validators.compose([Validators.required, AuthValidator.emailValidator,
        AuthValidator.noWhiteSpace])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16),
        AuthValidator.passwordValidator, AuthValidator.noWhiteSpace])
      ],
      passwordConfirm: ['', Validators.required],
      username: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20),
        AuthValidator.usernameValidator, AuthValidator.noWhiteSpace])
      ]
    }, { validator: AuthValidator.passwordMatchValidator });

    this.email = this.registerForm.get('email');
    this.password = this.registerForm.get('password');
    this.passwordConfirm = this.registerForm.get('passwordConfirm');
    this.username = this.registerForm.get('username');
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
