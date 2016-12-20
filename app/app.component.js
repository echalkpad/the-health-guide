"use strict";
var core_1 = require("@angular/core");
var angular_1 = require("nativescript-telerik-ui/sidedrawer/angular");
var firebase = require("nativescript-plugin-firebase");
var AppComponent = (function () {
    function AppComponent(changeDetectionRef) {
        this.changeDetectionRef = changeDetectionRef;
        this.counter = 16;
    }
    Object.defineProperty(AppComponent.prototype, "message", {
        get: function () {
            if (this.counter > 0) {
                return this.counter + " taps left ....";
            }
            else {
                return "Hoorraaay! \nYou are ready to start building!";
            }
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.openDrawer = function () {
        this.drawerComponent.sideDrawer.showDrawer();
    };
    AppComponent.prototype.toggle = function () {
        this.drawer.toggleDrawerState();
    };
    AppComponent.prototype.onTap = function () {
        this.counter--;
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        firebase.addChildEventListener(function (data) { return _this.demoData = data; }, '/demo');
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