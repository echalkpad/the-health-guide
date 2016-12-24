import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'

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
    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
        });
        this.emailControl = this.loginForm.controls['email'];
        this.passwordControl = this.loginForm.controls['password'];
    }
}