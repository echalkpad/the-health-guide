// App
import { CommonModule } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': 'af911689'
    },
    'auth': {
        'facebook': {
            'scope': ['email', 'public_profile', 'user_friends']
        },
        'google': {
            'webClientId': '493536537981-gfrb9dtsnltvsslcv0os8foq8is80j67.apps.googleusercontent.com',
            'scope': ['']
        }
    }
}

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
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService,
    FoodService,
    NutrientService
];