import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { thirdPartyImports } from './config/imports/third-party'
import { AppComponent } from './app.component';
import { thgDeclarations, thgImports, thgProviders } from './config/imports/thg';


@NgModule({
  declarations: [
    AppComponent,
    ...thgDeclarations
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
