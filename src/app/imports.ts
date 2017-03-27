// App
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

// Components
import { ErrorMessageComponent } from '../components';

// Pages
import {
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    LoginPage,
    NutrientPage,
    SignupPage
} from '../pages';

// Pipes
import { CapitalizePipe } from '../pipes'

// Providers
import {
    CustomValidationService,
    FoodService,
    NutrientService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    CapitalizePipe,
    ErrorMessageComponent,
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    LoginPage,
    NutrientPage,
    SignupPage
];

export const thgEntries = [
    MyApp,
    FoodDetailsPage,
    FoodListPage,
    HomePage,
    LoginPage,
    NutrientPage,
    SignupPage
];

export const thgImports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
];

export const thgProviders = [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CustomValidationService,
    FoodService,
    NutrientService
];