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
import { FoodListResolve } from './food/food-list/food-list-resolve.service';
import { FoodService } from './food/shared/food.service';
import { MacronutrientResolve } from './nutrients/shared/macronutrient-resolve.service';
import { MicronutrientResolve } from './nutrients/shared/micronutrient-resolve.service';
import { NutrientDetailComponent } from './nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from './nutrients/shared/nutrient-detail-resolve.service';
import { NutrientListComponent } from './nutrients/nutrient-list/nutrient-list.component';
import { NutrientService } from './nutrients/shared/nutrient.service';
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
    NutritionInfoComponent,
    NutrientListComponent,
    NutrientDetailComponent
  ],
  providers: [
    FoodService,
    FoodListResolve,
    MacronutrientResolve,
    MicronutrientResolve,
    NutrientDetailResolve,
    NutrientService
  ]
})
export class NutritionModule { }
