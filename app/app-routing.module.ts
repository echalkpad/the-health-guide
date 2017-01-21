import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodDetailComponent, FoodListComponent } from './food';
import { HomeComponent } from './home/home.component';
import { MealSearchComponent } from './meal-search';
import { NutrientDetailComponent, NutrientListComponent } from './nutrients';
import { RecipeDetailComponent, RecipeEditComponent, RecipeListComponent } from './recipes';

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'food',
        children: [
          {
            path: ':key',
            component: FoodDetailComponent,
          },
          {
            path: '',
            component: FoodListComponent
          }
        ]
      },
      {
        path: 'meal-search',
        component: MealSearchComponent
      },
      {
        path: 'nutrients',
        children: [
          {
            path: ':category/:key',
            component: NutrientDetailComponent
          },
          {
            path: '',
            component: NutrientListComponent
          }
        ]
      },
      {
        path: 'recipes',
        children: [
          {
            path: ':key',
            component: RecipeDetailComponent
          },
          {
            path: ':authId/:key',
            component: RecipeEditComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: '',
            component: RecipeListComponent
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(appRoutes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }