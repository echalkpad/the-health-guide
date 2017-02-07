// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// THG
import { Auth, AuthComponent, AuthGuardService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FoodListComponent } from '../../foods';
import { HomeComponent } from '../../home/home.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'foods',
        component: FoodListComponent
      },
      {
        path: '',
        component: HomeComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }