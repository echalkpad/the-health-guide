import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountEditResolve } from './account-edit/account-edit-resolve.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
  {
    path: 'account',
    component: AccountEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      account: AccountEditResolve
    }
  },
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
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }