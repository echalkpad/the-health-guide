"use strict";
var core_1 = require('@angular/core');
var firebase = require('nativescript-plugin-firebase');
var auth_model_1 = require('./auth.model');
var data_service_1 = require('../shared/data.service');
var AuthService = (function () {
    function AuthService(dataSvc) {
        this.dataSvc = dataSvc;
    }
    AuthService.prototype.getAvatar = function (imgName) {
    };
    AuthService.prototype.getAuthData = function () {
        //return this.dataSvc.getAuthData();
    };
    AuthService.prototype.getAuth = function () {
        return this.dataSvc.getAuth();
    };
    AuthService.prototype.getUserData = function (userId) {
        return new Promise(function (resolve, reject) {
            firebase.query(function (res) {
                if (res.hasOwnProperty('error')) {
                    reject(res);
                }
                else {
                    resolve(res);
                }
            }, "users/" + userId, {
                singleEvent: true,
                orderBy: {
                    type: firebase.QueryOrderByType.KEY
                }
            });
        });
    };
    AuthService.prototype.login = function (credentials) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                email: credentials.email,
                password: credentials.password
            }).then(function (authData) {
                if (!!authData) {
                    console.log(authData);
                    _this.getUserData(authData.uid).then(function (data) {
                        _this.dataSvc.saveAuth(new auth_model_1.Auth(authData.uid, data.avatar, data.name));
                        _this.dataSvc.saveUser(data);
                        resolve(true);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    AuthService.prototype.logout = function () {
        this.dataSvc.removeAuth();
        this.dataSvc.removeUser();
        firebase.logout();
    };
    AuthService.prototype.signUp = function (credentials) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            firebase.createUser({
                email: credentials.email,
                password: credentials.password
            }).then(function (authData) {
                if (!!authData) {
                    firebase.push("/users/" + authData.key, credentials);
                    _this.dataSvc.saveAuth(new auth_model_1.Auth(authData.key, credentials.avatar, credentials.name));
                    _this.dataSvc.saveUser(credentials);
                    resolve(true);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    AuthService.prototype.saveUserData = function (authId, user) {
        delete user['$key'];
        delete user['$exists'];
        firebase.update("/users/" + authId, user);
    };
    AuthService.prototype.uploadAvatar = function (img) {
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [data_service_1.DataService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map