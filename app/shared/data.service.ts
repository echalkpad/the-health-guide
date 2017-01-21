// Angular
import { Injectable } from '@angular/core';

// Nativescript
import * as appSettings from 'application-settings';

// THG
import { Auth, User } from '../auth';
import { Food } from '../food';
import { Nutrient } from '../nutrients';
import { Recipe } from '../recipes';

@Injectable()
export class DataService {

  constructor() { }

  public getAuth(): Auth {
    if (!appSettings.getString('auth')) {
      return null;
    }
    return JSON.parse(appSettings.getString('auth'));
  }

  public removeAuth(): void {
    appSettings.remove('auth');
  }

  public saveAuth(auth: Auth): void {
    appSettings.setString('auth', JSON.stringify(auth));
  }

  public getUser(): User {
    if (!appSettings.getString('user')) {
      return null;
    }
    return JSON.parse(appSettings.getString('user'));
  }

  public removeUser(): void {
    appSettings.remove('user');
  }

  public saveUser(user: User): void {
    appSettings.setString('user', JSON.stringify(user));
  }

}
