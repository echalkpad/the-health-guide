import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';
import { User } from '../auth/user.model';

@Injectable()
export class AccountEditResolve  implements Resolve<User> {

  constructor(private authSvc: AuthService, private dataSvc: DataService) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<User> {
    return new Promise(resolve => {
      if (!this.dataSvc.getUser()) {
        this.authSvc.getUserData(this.authSvc.getAuthData().id).subscribe((data: User) => {
          if (!!data) {
            resolve(data);
          }
        });
      } else {
        resolve(this.dataSvc.getUser());
      }
    });
  }

}
