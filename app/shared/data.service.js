"use strict";
var core_1 = require('@angular/core');
var appSettings = require("application-settings");
var DataService = (function () {
    function DataService() {
    }
    DataService.prototype.getAuth = function () {
        return JSON.parse(appSettings.getString('auth'));
    };
    DataService.prototype.removeAuth = function () {
        appSettings.remove('auth');
    };
    DataService.prototype.saveAuth = function (auth) {
        appSettings.setString('auth', JSON.stringify(auth));
    };
    DataService.prototype.getUser = function () {
        return JSON.parse(appSettings.getString('user'));
    };
    DataService.prototype.removeUser = function () {
        appSettings.remove('user');
    };
    DataService.prototype.saveUser = function (user) {
        appSettings.setString('user', JSON.stringify(user));
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map