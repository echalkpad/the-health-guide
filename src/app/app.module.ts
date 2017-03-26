import { NgModule } from '@angular/core';
import { IonicApp } from 'ionic-angular';

import { thgDeclarations, thgEntries, thgImports, thgProviders } from './imports';

@NgModule({
  declarations: [...thgDeclarations],
  imports: [...thgImports],
  bootstrap: [IonicApp],
  entryComponents: [...thgEntries],
  providers: [...thgProviders]
})
export class AppModule {}
