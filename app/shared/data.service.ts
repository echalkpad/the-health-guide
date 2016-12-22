import { Injectable } from '@angular/core';
import * as appSettings from "application-settings";

import { Auth } from '../auth/auth.model';
import { User } from '../auth/user.model';

@Injectable()
export class DataService {

  constructor() { }

  public getAuth(): Auth {
    return JSON.parse(appSettings.getString('auth'));
  }

  public removeAuth(): void {
    appSettings.remove('auth');
  }

  public saveAuth(auth: Auth): void {
    appSettings.setString('auth', JSON.stringify(auth));
  }

  public getUser(): User {
    return JSON.parse(appSettings.getString('user'));
  }

  public removeUser(): void {
    appSettings.remove('user');
  }

  public saveUser(user: User): void {
    appSettings.setString('user', JSON.stringify(user));
  }

}
