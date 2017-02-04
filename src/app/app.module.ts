import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  thirdPartyImports,
  thgDeclarations,
  thgImports,
  thgProviders
} from './config'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ...thgDeclarations,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ...thirdPartyImports,
    ...thgImports
  ],
  providers: [...thgProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
