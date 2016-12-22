import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { thirdPartyImports } from './config/imports/third-party'
import { AppComponent } from './app.component';
import { thgDeclarations, thgImports, thgProviders } from './config/imports/thg';


@NgModule({
  declarations: [
    
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
