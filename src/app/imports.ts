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
    NutrientsPage
} from '../pages';

// Providers
import {
    FoodService,
    NutrientDataService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    FoodDetailsPage,
    FoodListPage,
    NutrientsPage
];

export const thgEntries = [
    MyApp,
    FoodDetailsPage,
    FoodListPage,
    NutrientsPage
];

export const thgImports = [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
];

export const thgProviders = [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FoodService,
    NutrientDataService
];