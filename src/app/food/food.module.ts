import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { Food } from './food.model';
import { FoodDetailComponent } from './food-detail/food-detail.component';
import { FoodListComponent } from './food-list/food-list.component';
import { FoodRoutingModule } from './food-routing.module';
import { FoodService } from './food.service';

@NgModule({
  imports: [
    MaterialModule,
    FoodRoutingModule
  ],
  declarations: [
    FoodDetailComponent,
    FoodListComponent
  ],
  providers: [FoodService]
})
export class FoodModule { }
