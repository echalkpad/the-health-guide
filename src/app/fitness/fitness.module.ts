import { NgModule } from '@angular/core';

import { thirdPartyImports, thirdPartyEntries } from './config/imports/third-party';
import { thgImports } from './config/imports/thg';
import { fitnessDeclarations, fitnessImports, fitnessProviders } from './config/imports/fitness';

@NgModule({
  imports: [
    ...thirdPartyImports,
    ...thgImports,
    ...fitnessImports
  ],
  entryComponents: [...thirdPartyEntries],
  declarations: [
    ...fitnessDeclarations
  ],
  providers: [
    ...fitnessProviders
  ]
})
export class FitnessModule { }
