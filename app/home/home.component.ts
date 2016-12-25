import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";

import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";

import { Auth } from '../auth';
import { DataService } from '../shared';

@Component({
    moduleId: module.id,
    selector: 'thg-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    public auth: Auth = new Auth();
    constructor(private changeDetectionRef: ChangeDetectorRef, private dataSvc: DataService) { }

    public toggleDrawer(): void {
        this.drawer.toggleDrawerState();
    }

    ngOnInit(): void {
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
        this.auth = this.dataSvc.getAuth();
    }
}