import { DataService } from '../../shared/data.service';
import { FitnessComponent } from '../../fitness/fitness.component';
import { Food } from '../../food/shared/food.model';
import { FoodDetailComponent } from '../../food/food-detail/food-detail.component';
import { FoodDetailResolve } from '../../food/food-detail/food-detail-resolve.service';
import { FoodListComponent } from '../../food/food-list/food-list.component';
import { FoodService } from '../../food/shared/food.service';
import { NutrientDetailComponent } from '../../nutrients/nutrient-detail/nutrient-detail.component';
import { NutrientDetailResolve } from '../../nutrients/nutrient-detail/nutrient-detail-resolve.service';
import { NutrientListComponent } from '../../nutrients/nutrient-list/nutrient-list.component';
import { NutrientService } from '../../nutrients/shared/nutrient.service';
import { NutritionComponent } from '../../nutrition.component';
import { NutritionRoutingModule } from '../../nutrition-routing.module';
import { NutritionInfoComponent } from '../../nutrition-info/nutrition-info.component';
import { RecipeDataService } from '../../recipes/shared/recipe-data.service';
import { RecipeDetailResolve } from '../../recipes/recipe-detail/recipe-detail-resolve.service';
import { RecipeDetailComponent } from '../../recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from '../../recipes/recipe-edit/recipe-edit.component';
import { RecipeListComponent } from '../../recipes/recipe-list/recipe-list.component';
import { RecipeService } from '../../recipes/shared/recipe.service';

export const nutritionDeclarations = [
    FitnessComponent,
    FoodDetailComponent,
    FoodListComponent,
    NutritionComponent,
    NutritionInfoComponent,
    NutrientListComponent,
    NutrientDetailComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent
];

export const nutritionImports = [NutritionRoutingModule];

export const nutritionProviders = [
    DataService,
    FoodDetailResolve,
    FoodService,
    NutrientDetailResolve,
    NutrientService,
    RecipeDataService,
    RecipeDetailResolve,
    RecipeService
];