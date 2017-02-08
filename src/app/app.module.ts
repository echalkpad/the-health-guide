import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  thirdPartyImports,
  thgDeclarations,
  thgImports,
  thgProviders
} from './config'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ...thgDeclarations,
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
