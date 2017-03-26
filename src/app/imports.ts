import { CommonModule } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { Facebook } from '@ionic-native/facebook';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '7020a3ca'
    },
    'auth': {
        'facebook': {
            'scope': ['public_profile', 'user_friends', 'email']
        }
    }
}

import { MyApp } from './app.component';

// Pages
import {
    AuthPage,
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    NutrientPage,
} from '../pages';

// Pipes
import { CapitalizePipe } from '../pipes'

// Providers
import {
    AuthService,
    FoodService,
    NutrientService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    AuthPage,
    CapitalizePipe,
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    NutrientPage
];

export const thgEntries = [
    MyApp,
    AuthPage,
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    NutrientPage
];

export const thgImports = [
    CommonModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
];

export const thgProviders = [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    AuthService,
    FoodService,
    NutrientService
];