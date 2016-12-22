"use strict";
var core_1 = require('@angular/core');
var router_1 = require('nativescript-angular/router');
var auth_component_1 = require('./auth/auth.component');
var auth_guard_service_1 = require('./auth/auth-guard.service');
var home_component_1 = require('./home/home.component');
var appRoutes = [
    {
        path: 'home',
        component: home_component_1.HomeComponent,
        canActivate: [auth_guard_service_1.AuthGuard]
    },
    {
        path: '',
        component: auth_component_1.AuthComponent
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(appRoutes)],
            exports: [router_1.NativeScriptRouterModule],
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map