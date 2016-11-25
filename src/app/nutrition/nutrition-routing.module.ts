import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodDetailResolve } from './food/food-detail/food-detail-resolve.service';
import { FoodListComponent } from './food/food-list/food-list.component';
import { NutrientDetailComponent } from './nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from './nutrients/nutrient-detail/nutrient-detail-resolve.service';
import { NutrientListComponent } from './nutrients/nutrient-list/nutrient-list.component';
import { NutritionComponent } from './nutrition.component';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';
import { RecipeDetailResolve } from './recipes/recipe-detail/recipe-detail-resolve.service';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';

const nutritionRoutes: Routes = [
    {
        path: 'nutrition',
        component: NutritionComponent,
        children: [
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
                        path: ':key',
                        component: RecipeDetailComponent,
                        resolve: {
                            recipe: RecipeDetailResolve
                        }
                    },
                    {
                        path: '',
                        component: RecipeListComponent
                    }
                ]
            },
            {
                path: '',
                component: NutritionInfoComponent,
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(nutritionRoutes)],
    exports: [RouterModule]
})
export class NutritionRoutingModule { }