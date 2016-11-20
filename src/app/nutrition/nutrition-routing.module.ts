import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { FoodListResolve } from './food/food-list/food-list-resolve.service';
import { MacronutrientResolve } from './nutrients/shared/macronutrient-resolve.service';
import { MicronutrientResolve } from './nutrients/shared/micronutrient-resolve.service';
import { NutrientDetailComponent } from './nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from './nutrients/shared/nutrient-detail-resolve.service';
import { NutrientListComponent } from './nutrients/nutrient-list/nutrient-list.component';
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
                children: [
                    {
                        path: '',
                        component: NutrientListComponent,
                        resolve: {
                            macronutrients: MacronutrientResolve,
                            micronutrients: MicronutrientResolve
                        }
                    },
                    {
                        path: ':category/:key',
                        component: NutrientDetailComponent,
                        resolve: {
                            nutrient: NutrientDetailResolve
                        }
                    }
                ]
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(nutritionRoutes)],
    exports: [RouterModule]
})
export class NutritionRoutingModule { }