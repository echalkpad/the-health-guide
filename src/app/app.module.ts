import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { CovalentCoreModule, TD_LOADING_ENTRY_COMPONENTS } from '@covalent/core';
import { CovalentChipsModule } from '@covalent/chips';
import { CovalentFileModule } from '@covalent/file-upload';
import { CovalentHttpModule } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentJsonFormatterModule } from '@covalent/json-formatter';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentChartsModule } from '@covalent/charts';
import { CovalentDataTableModule } from '@covalent/data-table';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes, appRoutingProviders } from './app.routes';

import { RequestInterceptor } from '../config/interceptors/request.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    BrowserModule,
    CovalentCoreModule.forRoot(),
    CovalentChartsModule.forRoot(),
    CovalentChipsModule.forRoot(),
    CovalentDataTableModule.forRoot(),
    CovalentFileModule.forRoot(),
    CovalentHttpModule.forRoot([RequestInterceptor]),
    CovalentHighlightModule.forRoot(),
    CovalentJsonFormatterModule.forRoot(),
    CovalentMarkdownModule.forRoot(),
    appRoutes,
  ], // modules needed to run this module
  providers: [
    appRoutingProviders
  ], // additional providers needed for this module
  entryComponents: [ TD_LOADING_ENTRY_COMPONENTS ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
