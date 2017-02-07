import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  thirdPartyImports,
  thgDeclarations,
  thgImports,
  thgProviders
} from './config'

import { AppComponent } from './app.component';
import { FoodComponent } from './food/food.component';

@NgModule({
  declarations: [
    AppComponent,
    ...thgDeclarations,
    FoodComponent,
  ],
  imports: [
    BrowserModule,
    ...thirdPartyImports,
    ...thgImports
  ],
  providers: [...thgProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
