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
        private authSvc: AuthService,
        private dialogSvc: TdDialogService,
        private loadingSvc: TdLoadingService,
        private route: ActivatedRoute,
        private router: Router,
        private toast: MdSnackBar
    ) { }

    private showError(msg: string | Error): void {
        this.dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: 'Login failed',
            closeButton: 'Close'
        });
    }

    public passLogin(): void {
        this.loadingSvc.register('auth.load');
        this.authSvc.login(this.user).then(success => {
            this.loadingSvc.resolve('auth.load');
            let redirect = !!this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/home';
            this.router.navigate([redirect]);
        }).catch(err => {
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
        this.loadingSvc.register('auth.load');
        this.authSvc.signUp(this.user).then(() => {
            this.loadingSvc.resolve('auth.load');
            let redirect = !!this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/home';
            this.dialogSvc.openAlert({
                message: 'Account created successfully',
                disableClose: false,
                title: 'Success',
                closeButton: 'Close'
            }).afterClosed().subscribe(() => this.router.navigate([redirect]));
            this.router.navigate([redirect])
        }).catch(err => {
            this.loadingSvc.resolve('auth.load');
            this.showError(err);
        });
    }

    public uploadAvatar(img: File): void {
        this.authSvc.uploadAvatar(img).then(() => {
            this.user.avatar = img.name; this.toast.open('Upload complete!', 'OK');
        });
    }

    ngOnInit(): void {
        if (this.authSvc.getAuthData()) {
            setTimeout(() => this.router.navigate(['/home']), 1000);
        }
    }

}
