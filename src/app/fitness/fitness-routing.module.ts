import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityTrackComponent } from './activity-track/activity-track.component'
import { AuthGuard } from '../auth/auth-guard.service';
import { FitnessComponent } from './fitness.component';
import { MealTrackComponent } from './meal-track/meal-track.component'

const fitnessRoutes: Routes = [
  {
    path: 'fitness',
    canActivate: [AuthGuard],
    component: FitnessComponent,
    children: [
        {
            path: 'tracking',
            canActivateChild: [AuthGuard],
            children: [
                {
                    path: 'activities',
                    component: ActivityTrackComponent
                },
                {
                    path: 'meals',
                    component: MealTrackComponent
                }
            ]
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(fitnessRoutes)],
  exports: [RouterModule],
})
export class FitnessRoutingModule { }