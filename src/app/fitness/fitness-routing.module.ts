import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityTrackComponent } from './activity-track/activity-track.component'
import { ActivityTrackResolve } from './activity-track/activity-track-resolve.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { CanDeactivateGuard } from '../shared/can-deactivate-guard.service';
import { FitnessComponent } from './fitness.component';
import { FitnessProfileComponent } from './fitness-profile/fitness-profile.component';
import { FitnessProfileResolve } from './fitness-profile/fitness-profile-resolve.service';
import { MealTrackComponent } from './meal-track/meal-track.component';
import { MealTrackResolve } from './meal-track/meal-track-resolve.service';

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
                    component: ActivityTrackComponent,
                    resolve: {
                        activityTrack: ActivityTrackResolve
                    },
                    canDeactivate: [CanDeactivateGuard]
                },
                {
                    path: 'meals',
                    component: MealTrackComponent,
                    resolve: {
                        mealTrack: MealTrackResolve
                    },
                    canDeactivate: [CanDeactivateGuard]
                }
            ]
        },
        {
            path: 'profile',
            component: FitnessProfileComponent,
            canActivate: [AuthGuard],
            canDeactivate: [CanDeactivateGuard],
            resolve: {
                profile: FitnessProfileResolve
            }
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(fitnessRoutes)],
  exports: [RouterModule],
})
export class FitnessRoutingModule { }