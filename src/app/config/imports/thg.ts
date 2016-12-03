import { AppRoutingModule } from '../../app-routing.module';
import { AuthComponent } from '../../auth/auth.component';
import { AuthGuard } from '../../auth/auth-guard.service';
import { AuthService } from '../../auth/auth.service';
import { HelperService } from '../../shared/helper.service';
import { HomeComponent } from '../../home/home.component';
import { NutritionModule } from '../../nutrition/nutrition.module';

export const thgDeclarations = [
    HomeComponent,
    AuthComponent
];

export const thgImports = [
    AppRoutingModule,
    NutritionModule
];

export const thgProviders = [
    AuthGuard,
    AuthService,
    HelperService
];