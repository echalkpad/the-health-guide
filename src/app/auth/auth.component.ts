// TODO: Add user details (e.g. avatar, username) and save them in users database
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TdDialogService, TdLoadingService } from '@covalent/core';

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public registering: boolean = false;
  public user = new User();
  constructor(
    private authSvc: AuthService,
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
    this.authSvc.facebookLogin().then(success => setTimeout(() => this.router.navigate(['/home']), 1000)).catch(err => this.showError(err));
  }

  public githubLogin(): void {
    this.authSvc.githubLogin().then(success => setTimeout(() => this.router.navigate(['/home']), 1000)).catch(err => this.showError(err));
  }

  public googleLogin(): void {
    this.authSvc.googleLogin().then(success => {
      console.log(success);
    }).catch(err => this.showError(err));
  }

  public passLogin(credentials: { email: string, password: string }): void {
    this.authSvc.login(credentials).then(success => setTimeout(() => this.router.navigate(['/home']), 1000)).catch(err => this.showError(err));
  }

  public register(): void {
    this.registering = true;
  }

  public signIn(): void {
    this.registering = false;
  }

  public signUp(): void {
    this.authSvc.signUp(this.user).then(success => setTimeout(() => this.router.navigate(['/home']), 1000)).catch(err => this.showError(err));
  }

  public twitterLogin(): void {
    this.authSvc.twitterLogin().then(success => setTimeout(() => this.router.navigate(['/home']), 1000)).catch(err => this.showError(err));
  }

  ngOnInit(): void {
    if (this.authSvc.user.isLoggedIn) {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }
  }

}
