import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodDetailComponent, FoodDetailResolve, FoodListComponent } from './food';
import { HomeComponent } from './home/home.component';
import { MealSearchComponent } from './meal-search';
import { NutrientDetailComponent, NutrientDetailResolve, NutrientListComponent } from './nutrients';
import { RecipeDetailComponent, RecipeDetailResolve, RecipeEditComponent, RecipeListComponent } from './recipes';

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
            resolve: {
              food: FoodDetailResolve
            }
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
            component: NutrientDetailComponent,
            resolve: {
              nutrient: NutrientDetailResolve
            }
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
            path: ':authId/:key',
            component: RecipeDetailComponent,
            resolve: {
              recipe: RecipeDetailResolve
            }
          },
          {
            path: ':authId/:key/edit',
            component: RecipeEditComponent,
            resolve: {
              recipe: RecipeDetailResolve
            },
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