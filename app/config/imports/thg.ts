// Angular
import { ReactiveFormsModule } from '@angular/forms';

// Nativescript
import { NativeScriptModule } from 'nativescript-angular/platform';
import { NativeScriptHttpModule } from 'nativescript-angular/http';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';

// THG
import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent, AuthGuard, AuthService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FoodDetailComponent, FoodListComponent, FoodService } from '../../food';
import { HomeComponent } from '../../home/home.component';
import { MealSearchComponent, MealSearchService } from '../../meal-search';
import { NutrientDetailComponent, NutrientListComponent, NutrientService } from '../../nutrients';
import { RecipeDataService, RecipeDetailComponent, RecipeEditComponent, RecipeListComponent, RecipeService } from '../../recipes';
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
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule.forRoot()
];

export const thgProviders = [
    AuthGuard,
    AuthService,
    FoodService,
    MealSearchService,
    ModalDialogService,
    NutrientService,
    RecipeDataService,
    RecipeService
];