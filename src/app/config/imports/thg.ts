import { AccountEditComponent } from '../../account-edit/account-edit.component';
import { AccountEditResolve } from '../../account-edit/account-edit-resolve.service';
import { AccountEditService } from '../../account-edit/account-edit.service';
import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent } from '../../auth/auth.component';
import { AuthGuard } from '../../auth/auth-guard.service';
import { AuthService } from '../../auth/auth.service';
import { FitnessModule } from '../../fitness/fitness.module';
import { HelperService } from '../../shared/helper.service';
import { HomeComponent } from '../../home/home.component';
import { NutritionModule } from '../../nutrition/nutrition.module';

export const thgDeclarations = [
    AccountEditComponent,
    AuthComponent,
    HomeComponent
];

export const thgImports = [
    AppRoutingModule,
    FitnessModule,
    NutritionModule
];

export const thgProviders = [
    AccountEditResolve,
    AccountEditService,
    AuthGuard,
    AuthService,
    HelperService
];