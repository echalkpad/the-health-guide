"use strict";
var angular_1 = require("nativescript-telerik-ui/sidedrawer/angular");
var firebase = require('nativescript-plugin-firebase');
firebase.init({
    persist: true,
    storageBucket: 'gs://the-health-guide.appspot.com/'
}).then(function (instance) {
    console.log("firebase.init", instance);
}, function (error) {
    console.log("firebase.init error: " + error);
});
exports.thirdPartyImports = [];
exports.thirdPartyEntries = [];
exports.thirdPartyDeclarations = [
    angular_1.SIDEDRAWER_DIRECTIVES
];
//# sourceMappingURL=third-party.js.map