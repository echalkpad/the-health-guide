"use strict";
var platform_1 = require("nativescript-angular/platform");
var forms_1 = require("nativescript-angular/forms");
var forms_2 = require('@angular/forms');
var app_routing_module_1 = require('../../app-routing.module');
var auth_component_1 = require('../../auth/auth.component');
var auth_guard_service_1 = require('../../auth/auth-guard.service');
var auth_service_1 = require('../../auth/auth.service');
var home_component_1 = require('../../home/home.component');
exports.thgDeclarations = [
    auth_component_1.AuthComponent,
    home_component_1.HomeComponent
];
exports.thgEntries = [];
exports.thgImports = [
    forms_1.NativeScriptFormsModule,
    platform_1.NativeScriptModule,
    forms_2.ReactiveFormsModule,
    app_routing_module_1.AppRoutingModule
];
exports.thgProviders = [
    auth_guard_service_1.AuthGuard,
    auth_service_1.AuthService
];
//# sourceMappingURL=thg.js.map