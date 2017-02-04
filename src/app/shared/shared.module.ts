// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// THG
import { GroupPipe } from './pipes';
import { CanDeactivateGuardService, DataService, HelperService } from './services'

@NgModule({
  declarations: [GroupPipe],
  exports: [
    FormsModule,
    GroupPipe,
    HttpModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CanDeactivateGuardService, DataService, HelperService]
    };
  }
}