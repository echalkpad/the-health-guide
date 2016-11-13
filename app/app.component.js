"use strict";
var core_1 = require("@angular/core");
var firebase = require("nativescript-plugin-firebase");
var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBXdSjoVfk1KbbtmAUEq7ktnnI70ojg4y8",
    authDomain: "the-health-guide.firebaseapp.com",
    databaseURL: "https://the-health-guide.firebaseio.com",
    storageBucket: "the-health-guide.appspot.com",
    messagingSenderId: "283336744173"
};
firebase.init({}).then(function (instance) {
    console.log("firebase.init done");
}, function (error) {
    console.log("firebase.init error: " + error);
});
var AppComponent = (function () {
    function AppComponent() {
        this.counter = 16;
    }
    Object.defineProperty(AppComponent.prototype, "message", {
        get: function () {
            if (this.counter > 0) {
                return this.counter + " taps left";
            }
            else {
                return "Hoorraaay! \nYou are ready to start building!";
            }
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.onTap = function () {
        this.counter--;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "app.component.html",
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map