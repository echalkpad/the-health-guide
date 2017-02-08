// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// THG
import { Auth, AuthComponent, AuthGuard } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { 
  FoodDetailsComponent,
  FoodDetailsResolver,
  FoodListComponent
} from '../../foods';
import { HomeComponent } from '../../home/home.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'foods',
        children: [
          {
            path: ':id',
            component: FoodDetailsComponent,
            resolve: {
              food: FoodDetailsResolver
            }
          },
          {
            path: '',
            component: FoodListComponent
          }
        ]
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