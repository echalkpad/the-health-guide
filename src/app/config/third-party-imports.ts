// Firebase
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';

// Covalent
import { CovalentCoreModule } from '@covalent/core';
// (optional) Additional Covalent Modules imports
// import { CovalentHttpModule } from '@covalent/http';
// import { CovalentHighlightModule } from '@covalent/highlight';
// import { CovalentMarkdownModule } from '@covalent/markdown';
// import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';

export const FIREBASE_AUTH_CONFIG = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBXdSjoVfk1KbbtmAUEq7ktnnI70ojg4y8",
  authDomain: "the-health-guide.firebaseapp.com",
  databaseURL: "https://the-health-guide.firebaseio.com",
  storageBucket: "the-health-guide.appspot.com",
  messagingSenderId: "283336744173"
};

export const thirdPartyImports = [
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG, 'the-health-guide'),
    CovalentCoreModule.forRoot()
    // (optional) Additional Covalent Modules imports
    // CovalentHttpModule.forRoot(),
    // CovalentHighlightModule.forRoot(),
    // CovalentMarkdownModule.forRoot(),
    // CovalentDynamicFormsModule.forRoot(),
];