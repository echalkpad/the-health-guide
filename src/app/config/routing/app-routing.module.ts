// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// THG
import { Auth, AuthComponent, AuthGuardService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HomeComponent } from '../../home/home.component';


const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: '',
        component: AuthComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }