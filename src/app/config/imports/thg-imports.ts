import { AppRoutingModule } from '../routing';
import { AuthComponent, AuthGuard, AuthService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { 
    FoodDetailsComponent,
    FoodDetailsResolver,
    FoodListComponent,
    FoodService
} from '../../foods';
import { HomeComponent } from '../../home/home.component';
import { SharedModule } from '../../shared';

export const thgDeclarations = [
    AuthComponent,
    DashboardComponent,
    FoodDetailsComponent,
    FoodListComponent,
    HomeComponent
];

export const thgImports = [
    AppRoutingModule,
    SharedModule.forRoot()
];

export const thgProviders = [
    AuthGuard,
    AuthService,
    FoodDetailsResolver,
    FoodService
];