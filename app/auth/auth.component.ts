import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dialogs from "ui/dialogs";

import { Auth } from './auth.model'
import { AuthService } from './auth.service';
import { DataService } from '../shared';
import { User } from './user.model';

const EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    moduleId: module.id,
    selector: 'thg-auth',
    templateUrl: 'auth.component.html'
})
export class AuthComponent implements OnInit {
    public loginForm: FormGroup;
    public emailControl: AbstractControl;
    public email: string = '';
    public passwordControl: AbstractControl;
    public password: string = '';
    constructor(
        private authSvc: AuthService,
        private dataSvc: DataService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
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
            //let redirect = !!this.authSvc.redirectUrl ? this.authSvc.redirectUrl : '/home';
            this.router.navigate(["/home"]);
        }).catch((err: Error) => {
            this.showAlert('An error has occured', err);
        });
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        });
        this.emailControl = this.loginForm.controls['email'];
        this.passwordControl = this.loginForm.controls['password'];

        if (!!this.dataSvc.getAuth()) {
            setTimeout(() => this.router.navigate(['/home']), 1000);
        }
    }
}