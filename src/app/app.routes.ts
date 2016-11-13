import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component: DashboardComponent}
];

export const appRoutingProviders: any[] = [

];

export const appRoutes: any = RouterModule.forRoot(routes, { useHash: true });
