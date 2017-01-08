// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { Page } from 'ui/page';

// THG
import { Auth } from './auth.model'
import { AuthService } from './auth.service';
import { DataService } from '../shared';
import { User } from './user.model';

const EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    moduleId: module.id,
    selector: 'thg-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
    public loginForm: FormGroup;
    public email: string = '';
    public password: string = '';
    public isLoading: boolean = false;
    constructor(
        private _authSvc: AuthService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _dataSvc: DataService,
        private _fb: FormBuilder,
        private _page: Page,
        private _router: RouterExtensions
    ) { }

    private showAlert(title: string, msg: Error | string): void {
        let options = {
            title: title,
            message: msg.toString(),
            okButtonText: "OK"
        };
        dialogs.alert(options).then(() => {
            console.log("Race chosen!");
        });
    }

    public passLogin(): void {
        this.isLoading = true;
        this._authSvc.login(this.loginForm.value).then(success => {
            let redirect = !!this._authSvc.redirectUrl ? this._authSvc.redirectUrl : '/';
            setTimeout(() => {
                this.isLoading = false;
                this._router.navigate([redirect]);
            }, 1000);
        }).catch((err: Error) => {
            this.showAlert('An error has occured', err);
        });
    }

    ngOnInit(): void {
        this._page.actionBarHidden = true;
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        });
        this._changeDetectionRef.detectChanges();
    }
}