import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food-detail/food-detail.component';
import { FoodListComponent } from './food-list/food-list.component';

const foodRoutes: Routes = [
    { path: 'food', component: FoodListComponent },
    { path: 'food/:id', component: FoodDetailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(foodRoutes)],
    exports: [RouterModule]
})
export class FoodRoutingModule { }