import { AppRoutingModule } from '../routing';
import { AuthComponent, AuthGuardService, AuthService } from '../../auth';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HomeComponent } from '../../home/home.component';
import { SharedModule } from '../../shared';

export const thgDeclarations = [
    AuthComponent,
    DashboardComponent,
    HomeComponent
];

export const thgImports = [
    AppRoutingModule,
    SharedModule.forRoot()
];

export const thgProviders = [
    AuthGuardService,
    AuthService
];