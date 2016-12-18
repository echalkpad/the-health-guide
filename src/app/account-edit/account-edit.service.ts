import { Injectable } from '@angular/core';

import { Auth } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';
import { User } from '../auth/user.model';

@Injectable()
export class AccountEditService {

  constructor(private authSvc: AuthService, private dataSvc: DataService) { }

  public updateAccount(account: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authSvc.getAuthData().then((auth: firebase.User) => {
        Promise.all([
          auth.updateEmail(account.email),
          auth.updatePassword(account.password),
          auth.updateProfile({
            displayName: account.name,
            photoURL: account.avatar
          })
        ]).then(() => {
          this.authSvc.saveUserData(auth.uid, account);
          this.dataSvc.saveAuth(new Auth(auth.uid, account.avatar, account.name));
          this.dataSvc.saveUser(account);
          resolve(true);
        }).catch((res: any) => reject(res));
      });

    });
  }

}
