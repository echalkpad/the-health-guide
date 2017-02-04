// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

// Covalent
import { TdLoadingService } from '@covalent/core';

// THG
import { Auth, User } from './model';
import { AuthService } from './services';
import { HelperService } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
  public registering: boolean = false;
  public user: User = new User();
  constructor(
    private _authSvc: AuthService,
    private _detectorRef: ChangeDetectorRef,
    private _helpSvc: HelperService,
    private _loadingSvc: TdLoadingService,
    private _router: Router,
    private _titleSvc: Title,
    private _toast: MdSnackBar
  ) { }

  public passLogin(): void {
    this._loadingSvc.register('auth.load');
    this._authSvc.login(this.user).then(success => {
      this._loadingSvc.resolve('auth.load');
      let redirect = !!this._authSvc.redirectUrl ? this._authSvc.redirectUrl : '/home';
      this._router.navigate([redirect]);
    }).catch(err => {
      this._helpSvc.$showAlert('Something went wrong', err).subscribe(() => this._loadingSvc.resolve('auth.load'));
    });
  }

  public register(): void {
    this.registering = true;
  }

  public signIn(): void {
    this.registering = false;
  }

  public signUp(): void {
    this._loadingSvc.register('auth.load');
    this._authSvc.signUp(this.user).then(() => {
      this._loadingSvc.resolve('auth.load');
      let redirect = !!this._authSvc.redirectUrl ? this._authSvc.redirectUrl : '/home';
      this._helpSvc.$showAlert('Success', 'Account created successfully')
        .subscribe(() => this._router.navigate([redirect]));
      this._router.navigate([redirect])
    }).catch(err => {
      this._helpSvc.$showAlert('Something went wrong', err).subscribe(() => this._loadingSvc.resolve('auth.load'));
    });
  }

  public uploadAvatar(img: File): void {
    this._authSvc.uploadAvatar(img).then(() => {
      this.user.avatar = img.name; this._toast.open('Upload complete!', 'OK');
    });
  }

  ngOnInit(): void {
    this._authSvc.getAuth().then((auth: Auth) => {
      if (!!auth) {
        setTimeout(() => this._router.navigate(['home']));
      }
    });
    this._titleSvc.setTitle('Authentication');
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
