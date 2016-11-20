import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { FoodListResolveService } from './food/food-list/food-list-resolve.service';
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
                            foods: FoodListResolveService
                        }
                    },
                    {
                        path: ':id',
                        component: FoodDetailComponent
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