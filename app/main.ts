// Nativescript
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

// Angular
import { enableProdMode } from '@angular/core';

// THG
import { AppModule } from './app.module';

enableProdMode();

platformNativeScriptDynamic().bootstrapModule(AppModule);
