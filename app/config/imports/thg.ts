// Angular
import { ReactiveFormsModule } from '@angular/forms'

// Nativescript
import { NativeScriptModule } from 'nativescript-angular/platform';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// THG
import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent, AuthGuard, AuthService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FoodDetailComponent, FoodDetailResolve, FoodListComponent, FoodService } from '../../food';
import { HomeComponent } from '../../home/home.component';
import { MealSearchComponent, MealSearchService } from '../../meal-search';
import { NutrientDetailComponent, NutrientDetailResolve, NutrientListComponent, NutrientService } from '../../nutrients';
import { RecipeDataService, RecipeDetailComponent, RecipeDetailResolve, RecipeEditComponent, RecipeListComponent, RecipeService } from '../../recipes';
import { SharedModule } from '../../shared';

export const thgDeclarations = [
    AuthComponent,
    DashboardComponent,
    FoodDetailComponent,
    FoodListComponent,
    HomeComponent,
    MealSearchComponent,
    NutrientDetailComponent,
    NutrientListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeListComponent
];

export const thgEntries = [
    AuthComponent,
    DashboardComponent,
    FoodDetailComponent,
    FoodListComponent,
    HomeComponent,
    MealSearchComponent,
    NutrientDetailComponent,
    NutrientListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeListComponent
];

export const thgImports = [
    NativeScriptFormsModule,
    NativeScriptModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule.forRoot()
];

export const thgProviders = [
    AuthGuard,
    AuthService,
    FoodDetailResolve,
    FoodService,
    MealSearchService,
    NutrientDetailResolve,
    NutrientService,
    RecipeDataService,
    RecipeDetailResolve,
    RecipeService
];