// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { Page } from 'ui/page';
import { setTimeout } from 'timer';

// THG
import { Auth } from './auth.model'
import { AuthService } from './auth.service';
import { DataService } from '../shared';

const EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    moduleId: module.id,
    selector: 'thg-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
    public email: string = '';
    public isLoading: boolean = false;
    public loginForm: FormGroup;
    public logging: boolean = true;
    public password: string = '';
    public signUpForm: FormGroup;
    public username: string = '';
    constructor(
        private _authSvc: AuthService,
        private _dataSvc: DataService,
        private _detectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _page: Page,
        private _router: RouterExtensions
    ) { }

    private _showAlert(title: string, msg: Error | string): void {
        let options: dialogs.AlertOptions = {
            title: title,
            message: msg.toString(),
            okButtonText: 'OK'
        };
        dialogs.alert(options).then(() => {
            console.log('Race chosen!');
        });
    }

    public createAccount(): void {
        this.isLoading = true;
        this.isLoading = true;
        this._authSvc.signUp(this.signUpForm.value).then(success => {
            setTimeout(() => {
                this.isLoading = false;
                this._router.navigate(['/']);
            }, 1000);
        }).catch((err: Error) => {
            this._showAlert('Ooops! Something wnet wrong...!', err);
            setTimeout(() => {
                this.isLoading = false;
                this._router.navigate(['/login']);
            }, 1000);
        });
    }

    public passLogin(): void {
        this.isLoading = true;
        this._authSvc.login(this.loginForm.value).then(success => {
            setTimeout(() => {
                this.isLoading = false;
                this._router.navigate(['/']);
            }, 1000);
        }).catch((err: Error) => {
            this._showAlert('Ooops! Something wnet wrong...!', err);
            setTimeout(() => {
                this.isLoading = false;
                this._router.navigate(['/login']);
            }, 1000);
        });
    }

    public toggleLogging(): void {
        this.logging = !this.logging;
    }

    ngOnInit(): void {
        this._page.actionBarHidden = true;
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
        });
        this.signUpForm = this._fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
        });
    }
}