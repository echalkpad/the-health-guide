import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dialogs from "ui/dialogs";

import { Auth } from './auth.model'
import { AuthService } from './auth.service';
import { DataService } from '../shared';
import { User } from './user.model';

const EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    moduleId: module.id,
    selector: 'thg-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.css']
})
export class AuthComponent implements OnInit {
    public loginForm: FormGroup;
    public email: string = '';
    public password: string = '';
    constructor(
        private authSvc: AuthService,
        private dataSvc: DataService,
        private fb: FormBuilder,
        private router: Router
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
        this.authSvc.login(this.loginForm.value).then(success => {
            let redirect = !!this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/';
            this.router.navigate([redirect]);
        }).catch((err: Error) => {
            this.showAlert('An error has occured', err);
        });
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        });

        if (!!this.dataSvc.getAuth()) {
             this.router.navigate(['/'])
        }
    }
}