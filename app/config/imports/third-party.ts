// Telerik
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// frescoModule
import { NSFRESCO_DIRECTIVES } from 'nativescript-fresco/angular';
import { FrescoDrawee } from 'nativescript-fresco';
import * as frescoModule from 'nativescript-fresco';
import * as applicationModule from 'application';

firebase.init({
    persist: true,
    storageBucket: 'gs://the-health-guide.appspot.com/'
}).then(
    (instance) => {
        console.log('firebase.init', instance);
    },
    (error) => {
        console.log('firebase.init error: ' + error);
    }
);

if (applicationModule.android) {
    applicationModule.on('launch', () => {
        frescoModule.initialize();
        console.log('Fresco initialised');
    });
}

export const thirdPartyImports = [
];

export const thirdPartyEntries = [
];

export const thirdPartyDeclarations = [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES,
    NSFRESCO_DIRECTIVES
];