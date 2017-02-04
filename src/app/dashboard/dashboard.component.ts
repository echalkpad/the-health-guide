// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

// THG
import { IRouteLink } from '../config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy, OnInit {
  public routeLinks: IRouteLink[];
  constructor(private _detectorRef: ChangeDetectorRef, private _router: Router) {
    this.routeLinks = [
      {
        title: 'Home', route: '/', icon: 'home'
      }
    ];
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
