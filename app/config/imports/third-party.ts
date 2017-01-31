import * as applicationModule from 'application';

// Telerik
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// Fresco
import { TNSFrescoModule } from 'nativescript-fresco/angular';
import * as frescoModule from 'nativescript-fresco';

// Material icons
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';

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
    TNSFrescoModule,
    TNSFontIconModule.forRoot({
        'mdi': 'material-design-icons.css'
    })
];

export const thirdPartyEntries = [
];

export const thirdPartyDeclarations = [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES
];