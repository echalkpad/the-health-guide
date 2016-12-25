import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent, AuthGuard, AuthService } from '../../auth';
import { HomeComponent } from '../../home/home.component';
import { SharedModule } from '../../shared';

export const thgDeclarations = [
    AuthComponent,
    HomeComponent
];

export const thgEntries = [
];

export const thgImports = [
    NativeScriptFormsModule,
    NativeScriptModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule.forRoot()
];

export const thgProviders = [
    AuthGuard,
    AuthService
];