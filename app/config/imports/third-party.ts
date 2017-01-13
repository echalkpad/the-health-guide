// Nativescript
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';
import { NSFRESCO_DIRECTIVES } from 'nativescript-fresco/angular';
import { FrescoDrawee } from 'nativescript-fresco';
import * as frescoModule from 'nativescript-fresco';
import * as applicationModule from 'application';
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

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
    TNSFontIconModule.forRoot({
        'mdi': 'material-design-icons.css'
    })
];

export const thirdPartyEntries = [
];

export const thirdPartyDeclarations = [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES,
    NSFRESCO_DIRECTIVES
];