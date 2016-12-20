"use strict";
var core_1 = require("@angular/core");
var angular_1 = require("nativescript-telerik-ui/sidedrawer/angular");
var firebase = require("nativescript-plugin-firebase");
var AppComponent = (function () {
    function AppComponent(changeDetectionRef) {
        this.changeDetectionRef = changeDetectionRef;
    }
    AppComponent.prototype.toggle = function () {
        this.drawer.toggleDrawerState();
    };
    AppComponent.prototype.ngOnInit = function () {
        firebase.addChildEventListener(function (data) { return console.log(data); }, '/demo');
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
    };
    __decorate([
        core_1.ViewChild(angular_1.RadSideDrawerComponent), 
        __metadata('design:type', angular_1.RadSideDrawerComponent)
    ], AppComponent.prototype, "drawerComponent", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "app.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map