import { ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { FoodDetailsPage } from '../pages/food-details/food-details';
import { FoodListPage } from '../pages/food-list/food-list';
import { FoodService } from '../providers';

export const thgDeclarations = [
    MyApp,
    FoodDetailsPage,
    FoodListPage
];

export const thgEntries = [
    MyApp,
    FoodDetailsPage,
    FoodListPage
];

export const thgImports = [
    IonicModule.forRoot(MyApp)
];

export const thgProviders = [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FoodService
];