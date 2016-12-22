"use strict";
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var can_deactivate_guard_service_1 = require('./can-deactivate-guard.service');
var data_service_1 = require('./data.service');
var group_pipe_1 = require('./group.pipe');
var helper_service_1 = require('./helper.service');
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule,
            providers: [can_deactivate_guard_service_1.CanDeactivateGuard, data_service_1.DataService, helper_service_1.HelperService]
        };
    };
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [group_pipe_1.GroupPipe],
            exports: [
                forms_1.FormsModule,
                group_pipe_1.GroupPipe,
                http_1.HttpModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map