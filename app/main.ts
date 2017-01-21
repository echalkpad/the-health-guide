// Nativescript
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';
import * as frescoModule from 'nativescript-fresco';
import * as applicationModule from 'application';

// Angular
import { enableProdMode } from '@angular/core';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { AppModule } from './app.module';

firebase.init({
    persist: false,
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

enableProdMode();

platformNativeScriptDynamic().bootstrapModule(AppModule);
