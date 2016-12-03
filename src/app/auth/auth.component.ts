// TODO: Add user details (e.g. avatar, username) and save them in users database
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TdDialogService, TdLoadingService } from '@covalent/core';

import { Auth } from './auth.model'
import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public registering: boolean = false;
  public uploadReminder: boolean = false;
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

  public passLogin(): void {
    this.loadingSvc.register('auth.load');
    this.authSvc.login(this.user).then(success => setTimeout(() => {
      this.loadingSvc.resolve('auth.load');
      let redirect = this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/home';
      this.router.navigate([redirect]);
    }, 1000)).catch(err => {
      this.loadingSvc.resolve('auth.load');
      this.showError(err);
    });
  }

  public register(): void {
    this.registering = true;
  }

  public signIn(): void {
    this.registering = false;
  }

  public signUp(): void {
    if (!this.user.avatar) {
      this.uploadReminder = true;
    } else {
      this.loadingSvc.register('auth.load');
      this.authSvc.signUp(this.user).then(success => setTimeout(() => {
        this.loadingSvc.resolve('auth.load');
        let redirect = this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/home';
        this.router.navigate([redirect]);
      }, 1000)).catch(err => {
        this.loadingSvc.resolve('auth.load');
        this.showError(err);
      });
    }
  }

  public uploadAvatar(img: File): void {
    this.user.avatar = img.name;
    this.authSvc.uploadAvatar(img);
    this.uploadReminder = false;
  }

  ngOnInit(): void {
    if (this.authSvc.getAuthData()) {
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }
  }

}
