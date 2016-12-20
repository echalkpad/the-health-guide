import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    constructor(private changeDetectionRef: ChangeDetectorRef) {}

    public toggle() {
    this.drawer.toggleDrawerState();
  }

    ngOnInit(): void {
        firebase.addChildEventListener((data) => console.log(data), '/demo');
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
    }
}
