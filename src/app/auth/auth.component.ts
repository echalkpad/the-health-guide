// TODO: Add user details (e.g. avatar, username) and save them in users database
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

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
        private _authSvc: AuthService,
        private _dialogSvc: TdDialogService,
        private _loadingSvc: TdLoadingService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _toast: MdSnackBar
    ) { }

    private _showError(msg: string | Error): void {
        this._dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: 'Login failed',
            closeButton: 'Close'
        });
    }

    public passLogin(): void {
        this._loadingSvc.register('auth.load');
        this._authSvc.login(this.user).then(success => {
            this._loadingSvc.resolve('auth.load');
            let redirect = !!this._authSvc.redirectUrl ? this._authSvc.redirectUrl : '/home';
            this._router.navigate([redirect]);
        }).catch(err => {
            this._loadingSvc.resolve('auth.load');
            this._showError(err);
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
            this._dialogSvc.openAlert({
                message: 'Account created successfully',
                disableClose: false,
                title: 'Success',
                closeButton: 'Close'
            }).afterClosed().subscribe(() => this._router.navigate([redirect]));
            this._router.navigate([redirect])
        }).catch(err => {
            this._loadingSvc.resolve('auth.load');
            this._showError(err);
        });
    }

    public uploadAvatar(img: File): void {
        this._authSvc.uploadAvatar(img).then(() => {
            this.user.avatar = img.name; this._toast.open('Upload complete!', 'OK');
        });
    }

    ngOnInit(): void {
        if (this._authSvc.getAuth()) {
            setTimeout(() => this._router.navigate(['/home']), 1000);
        }
    }

}
