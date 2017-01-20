// Nativescript
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

// Angular
import { enableProdMode } from '@angular/core';

// THG
import { AppModule } from './app.module';
import { Auth } from './auth';
import { DataService } from './shared';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

firebase.init({
    persist: false,
    storageBucket: 'gs://the-health-guide.appspot.com/',
    onAuthStateChanged: (data: firebase.AuthStateData) => {
    console.log(JSON.stringify(data))
    if (data.loggedIn) {
      DataService.prototype.saveAuth(new Auth(data.user.uid, data.user.profileImageURL, data.user.name, data.user.email));
    }
    else {
      DataService.prototype.removeAuth();
    }
  }
}).then(
    (instance) => {
        console.log('firebase.init', instance);
    },
    (error) => {
        console.log('firebase.init error: ' + error);
    }
);

enableProdMode();

platformNativeScriptDynamic().bootstrapModule(AppModule);
