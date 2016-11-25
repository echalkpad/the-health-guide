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
import { CovalentPagingModule } from '@covalent/paging';
import { CovalentSearchModule } from '@covalent/search';

import { Food } from './food/shared/food.model';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodDetailResolve } from './food/food-detail/food-detail-resolve.service';
import { FoodListComponent } from './food/food-list/food-list.component';
import { FoodService } from './food/shared/food.service';
import { NutrientDetailComponent } from './nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from './nutrients/nutrient-detail/nutrient-detail-resolve.service';
import { NutrientListComponent } from './nutrients/nutrient-list/nutrient-list.component';
import { NutrientService } from './nutrients/shared/nutrient.service';
import { NutritionComponent } from './nutrition.component';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';
import { RecipeDetailResolve } from './recipes/recipe-detail/recipe-detail-resolve.service';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeService } from './recipes/shared/recipe.service';
import { GroupPipe } from './recipes/shared/group.pipe';

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
    CovalentPagingModule.forRoot(),
    CovalentSearchModule.forRoot(),
    NutritionRoutingModule
  ],
  entryComponents: [TD_LOADING_ENTRY_COMPONENTS],
  declarations: [
    FoodDetailComponent,
    FoodListComponent,
    GroupPipe,
    NutritionComponent,
    NutritionInfoComponent,
    NutrientListComponent,
    NutrientDetailComponent,
    RecipeListComponent,
    RecipeDetailComponent
  ],
  providers: [
    FoodDetailResolve,
    FoodService,
    NutrientDetailResolve,
    NutrientService,
    RecipeDetailResolve,
    RecipeService
  ]
})
export class NutritionModule { }
