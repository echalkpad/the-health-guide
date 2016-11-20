import { NgModule } from '@angular/core';

import { CovalentCoreModule, TD_LOADING_ENTRY_COMPONENTS } from '@covalent/core';
import { CovalentChipsModule } from '@covalent/chips';
import { CovalentFileModule } from '@covalent/file-upload';
import { CovalentHttpModule } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentJsonFormatterModule } from '@covalent/json-formatter';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentChartsModule } from '@covalent/charts';
import { CovalentDataTableModule } from '@covalent/data-table';

import { Food } from './food/shared/food.model';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { FoodListResolveService } from './food/food-list/food-list-resolve.service';
import { FoodService } from './food/shared/food.service';
import { NutritionComponent } from './nutrition.component';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';

@NgModule({
  imports: [
    CovalentCoreModule.forRoot(),
    CovalentChartsModule.forRoot(),
    CovalentChipsModule.forRoot(),
    CovalentDataTableModule.forRoot(),
    CovalentFileModule.forRoot(),
    CovalentHighlightModule.forRoot(),
    CovalentJsonFormatterModule.forRoot(),
    CovalentMarkdownModule.forRoot(),
    NutritionRoutingModule
  ],
  entryComponents: [TD_LOADING_ENTRY_COMPONENTS],
  declarations: [
    FoodDetailComponent,
    FoodListComponent,
    NutritionComponent,
    NutritionInfoComponent
  ],
  providers: [FoodService, FoodListResolveService]
})
export class NutritionModule { }
