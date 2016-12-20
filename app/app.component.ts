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
    public counter: number = 16;
    public demoData: any;
    constructor(private changeDetectionRef: ChangeDetectorRef) {}

    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left ....";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }
    
    public openDrawer(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    public toggle() {
    this.drawer.toggleDrawerState();
  }
    
    public onTap() {
        this.counter--;
    }

    ngOnInit(): void {
        firebase.addChildEventListener((data) => this.demoData = data, '/demo');
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
    }
}
