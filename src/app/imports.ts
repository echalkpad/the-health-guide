import { CommonModule } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '7020a3ca'
  }
};

import { MyApp } from './app.component';

// Pages
import {
    FoodDetailsPage,
    FoodListPage,
    NutrientDetailsPage,
    NutrientListPage
} from '../pages';

// Pipes
import { CapitalizePipe } from '../pipes'

// Providers
import {
    FoodService,
    NutrientDataService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    CapitalizePipe,
    FoodDetailsPage,
    FoodListPage,
    NutrientDetailsPage,
    NutrientListPage
];

export const thgEntries = [
    MyApp,
    FoodDetailsPage,
    FoodListPage,
    NutrientDetailsPage,
    NutrientListPage
];

export const thgImports = [
    CommonModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
];

export const thgProviders = [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FoodService,
    NutrientDataService
];