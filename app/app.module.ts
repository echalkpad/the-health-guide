import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { AppComponent } from "./app.component";
import { thirdPartyDeclarations } from './config/imports/third-party'
import { thgDeclarations, thgImports, thgProviders } from './config/imports/thg';

@NgModule({
    declarations: [
      ...thirdPartyDeclarations,
      AppComponent,
    ...thgDeclarations
    ],
    bootstrap: [AppComponent],
    imports: [
      ...thgImports
    ],
    providers: [
      ...thgProviders
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
