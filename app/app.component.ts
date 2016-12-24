import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";

import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";

@Component({
    selector: "thg-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    constructor(private changeDetectionRef: ChangeDetectorRef) { }

    public toggleDrawer(): void {
        this.drawer.toggleDrawerState();
    }

    ngOnInit(): void {
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
    }
}
