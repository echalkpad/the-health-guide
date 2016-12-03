import { AngularFireModule } from 'angularfire2';
import { CovalentCoreModule, TD_LOADING_ENTRY_COMPONENTS } from '@covalent/core';
import { CovalentFileModule } from '@covalent/file-upload';

import { FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG } from '../firebase-config'

export const thirdPartyImports = [
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG),
    CovalentCoreModule.forRoot(),
    CovalentFileModule.forRoot()
];

export const thirdPartyEntries = [
    TD_LOADING_ENTRY_COMPONENTS
];