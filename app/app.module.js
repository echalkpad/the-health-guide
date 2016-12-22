"use strict";
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var third_party_1 = require('./config/imports/third-party');
var thg_1 = require('./config/imports/thg');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: third_party_1.thirdPartyDeclarations.concat([
                app_component_1.AppComponent
            ], thg_1.thgDeclarations),
            bootstrap: [app_component_1.AppComponent],
            imports: thg_1.thgImports.slice(),
            schemas: [core_1.NO_ERRORS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map