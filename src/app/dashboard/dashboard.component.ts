// Angular
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

// THG
import { IRouteLink } from '../config';
import { AuthService } from '../auth';

@Component({
  moduleId: module.id,
  selector: 'thg-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy, OnInit {
  public routeLinks: Array<IRouteLink>;
  constructor(
    private _authSvc: AuthService,
    private _detectorRef: ChangeDetectorRef,
    private _router: Router
  ) {
    this.routeLinks = [
      {
        title: 'Home', route: '/', icon: 'home'
      },
      {
        title: 'USDA Foods', route: 'foods', icon: 'local_grocery_store'
      }
    ];
  }

  public logout(): void {
    this._authSvc.logout().then(() => this._router.navigate(['/login']));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
