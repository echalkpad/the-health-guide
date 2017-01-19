// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

// Nativescript
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";

// THG
import { Auth, AuthService } from '../auth';
import { DataService, DrawerService } from '../shared';

@Component({
    moduleId: module.id,
    selector: 'thg-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    public auth: Auth = new Auth();
    constructor(
        private _authSvc: AuthService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _dataSvc: DataService,
        public drawerSvc: DrawerService
    ) {  }

    public logout(): void {
        this._authSvc.logout();
    }

    ngOnInit(): void {
        this.drawerSvc.drawer = this.drawerComponent.sideDrawer;
        this.auth = this._dataSvc.getAuth();
    }
}