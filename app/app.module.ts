// Angular
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

// THG
import { AppComponent } from "./app.component";
import { thirdPartyDeclarations } from './config/imports/third-party'
import { thgDeclarations, thgEntries, thgImports, thgProviders } from './config/imports/thg';

@NgModule({
    declarations: [
      ...thirdPartyDeclarations,
      AppComponent,
    ...thgDeclarations
    ],
    entryComponents: [...thgEntries],
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
