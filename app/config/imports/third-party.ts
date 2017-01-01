// Telerik
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

firebase.init({
    persist: true,
    storageBucket: 'gs://the-health-guide.appspot.com/'
}).then(
    (instance) => {
        console.log("firebase.init", instance);
    },
    (error) => {
        console.log("firebase.init error: " + error);
    }
);

export const thirdPartyImports = [
];

export const thirdPartyEntries = [
];

export const thirdPartyDeclarations = [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES
];