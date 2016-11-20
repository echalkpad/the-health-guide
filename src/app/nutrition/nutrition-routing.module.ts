import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { FoodListResolve } from './food/food-list/food-list-resolve.service';
import { MacronutrientResolve } from './nutrients/services/macronutrient-resolve.service';
import { MicronutrientResolve } from './nutrients/services/micronutrient-resolve.service';
import { NutrientsComponent } from './nutrients/nutrients.component';
import { NutritionComponent } from './nutrition.component';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';

const nutritionRoutes: Routes = [
    {
        path: 'nutrition',
        component: NutritionComponent,
        children: [
            {
                path: '',
                component: NutritionInfoComponent,
            },
            {
                path: 'food',
                children: [
                    {
                        path: '',
                        component: FoodListComponent,
                        resolve: {
                            foods: FoodListResolve
                        }
                    },
                    {
                        path: ':id',
                        component: FoodDetailComponent
                    }
                ]
            },
            {
                path: 'nutrients',
                component: NutrientsComponent,
                resolve: {
                    macronutrients: MacronutrientResolve,
                    micronutrients: MicronutrientResolve
                }
            },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(nutritionRoutes)],
    exports: [RouterModule]
})
export class NutritionRoutingModule { }