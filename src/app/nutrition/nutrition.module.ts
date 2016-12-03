import { NgModule } from '@angular/core';

import { thirdPartyImports, thirdPartyEntries } from './config/imports/third-party';
import { thgImports } from './config/imports/thg';
import { nutritionDeclarations, nutritionImports, nutritionProviders } from './config/imports/nutrition';

@NgModule({
  imports: [
    ...thirdPartyImports,
    ...thgImports,
    ...nutritionImports
  ],
  entryComponents: [...thirdPartyEntries],
  declarations: [
    ...nutritionDeclarations
  ],
  providers: [
    ...nutritionProviders
  ]
})
export class NutritionModule { }
