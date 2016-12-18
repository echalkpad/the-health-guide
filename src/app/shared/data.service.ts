import { Injectable } from '@angular/core';

import { Auth } from '../auth/auth.model';
import { User } from '../auth/user.model';

@Injectable()
export class DataService {

  constructor() { }

  public getAuth(): Auth {
    return JSON.parse(sessionStorage.getItem('auth'));
  }

  public saveAuth(auth: Auth): void {
    sessionStorage.setItem('auth', JSON.stringify(Object.assign({}, auth)));
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  public saveUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(Object.assign({}, user)));
  }

}
