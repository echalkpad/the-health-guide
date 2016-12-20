import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/platform";
import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import firebase = require("nativescript-plugin-firebase");

firebase.init({
    persist: true,
    storageBucket: 'gs://the-health-guide.appspot.com/'
}).then(
  (instance) => {
    console.log("firebase.init", instance);
  },
  (error) => {
    console.log("firebase.init error: " + error);
  }
);

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [SIDEDRAWER_DIRECTIVES, AppComponent],
    bootstrap: [AppComponent],
    imports: [NativeScriptModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
