import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(appRoutes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }