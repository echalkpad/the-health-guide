"use strict";
var core_1 = require("@angular/core");
var platform_1 = require("nativescript-angular/platform");
var firebase = require("nativescript-plugin-firebase");
firebase.init({
    persist: true,
    storageBucket: 'gs://the-health-guide.appspot.com/'
}).then(function (instance) {
    console.log("firebase.init", instance);
}, function (error) {
    console.log("firebase.init error: " + error);
});
var app_component_1 = require("./app.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent],
            bootstrap: [app_component_1.AppComponent],
            imports: [platform_1.NativeScriptModule],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map