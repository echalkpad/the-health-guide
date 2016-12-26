import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { DataService } from './data.service';
import { DrawerService } from './drawer.service';
import { GroupPipe } from './group.pipe';
import { HelperService } from './helper.service';

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
      providers: [CanDeactivateGuard, DataService, DrawerService, HelperService]
    };
  }
}
