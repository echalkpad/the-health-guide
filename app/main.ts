// Nativescript
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';
import { registerElement } from 'nativescript-angular/element-registry';
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

// Angular
import { enableProdMode } from '@angular/core';

// THG
import { AppModule } from './app.module';

//enableProdMode();

platformNativeScriptDynamic().bootstrapModule(AppModule);
