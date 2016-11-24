import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { TdDialogService, TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public email: string;
  public password: string;
  constructor(
    private af: AngularFire,
    private dialogService: TdDialogService,
    private loadingSvc: TdLoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private showError(msg: any): void {
    this.dialogService.openAlert({
      message: msg,
      disableClose: false,
      title: 'Login failed',
      closeButton: 'Close'
    });
  }

  public fbLogin(): void {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Redirect
    }).then(authData => {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }).catch(error => {
      this.showError(error);
    });
  }

  public githubLogin(): void {
    this.af.auth.login({
      provider: AuthProviders.Github,
      method: AuthMethods.Redirect
    }).then(authData => {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }).catch(error => {
      this.showError(error);
    });
  }

  public googleLogin(): void {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    }).then(authData => {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }).catch(error => {
      this.showError(error);
    });
  }

  public passLogin(userCredentials: { email: string, password: string }): void {
    this.af.auth.login(userCredentials).then(authData => {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }).catch(error => {
      this.showError(error);
    });
  }

  public twitterLogin(): void {
    this.af.auth.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Redirect
    }).then(authData => {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }).catch(error => {
      this.showError(error);
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params['logout']) {
        this.af.auth.subscribe(auth => {
          if (!!auth && auth.hasOwnProperty('uid')) {
            setTimeout(() => this.router.navigate(['/home']), 1000);
          }
        });
      }
    });
  }

}
