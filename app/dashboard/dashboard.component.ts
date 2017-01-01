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
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    public auth: Auth = new Auth();
    constructor(
        private authSvc: AuthService,
        private changeDetectionRef: ChangeDetectorRef,
        private dataSvc: DataService,
        private drawerSvc: DrawerService
    ) {}

    public logout(): void {
        this.authSvc.logout();
    }

    ngOnInit(): void {
        this.drawerSvc.drawer = this.drawerComponent.sideDrawer;
        if (this.dataSvc.getAuth()) {
            this.auth = this.dataSvc.getAuth();
        }
        this.changeDetectionRef.detectChanges();
    }
}