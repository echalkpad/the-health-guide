// TODO: add users database in firebase

import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import { User } from './user.model';

@Injectable()
export class AuthService {
  public user: User = new User();
  constructor(private af: AngularFire) { }

  public facebookLogin(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      }).then(authData => {
        console.log(authData);
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public githubLogin(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login({
        provider: AuthProviders.Github,
        method: AuthMethods.Popup
      }).then(authData => {
        console.log(authData);
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public googleLogin(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login({
        provider: AuthProviders.Google,
        method: AuthMethods.Popup
      }).then(authData => {
        console.log(authData);
        resolve(authData);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public login(credentials: { email: string, password: string }): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login(credentials).then(authData => {
        console.log(authData);
        this.user.id = authData.uid;
        this.user.isLoggedIn = true;
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public logout(): void {
    this.af.auth.logout();
    this.user.isLoggedIn = false;
  }

  public signUp(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.user = Object.assign({}, credentials);
      this.af.auth.createUser({
        email: credentials.email,
        password: credentials.password
      }).then(authData => {
        this.user.id = authData.uid;
        this.user.isLoggedIn = true;
        console.log(this.user);
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public twitterLogin(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login({
        provider: AuthProviders.Twitter,
        method: AuthMethods.Popup
      }).then(authData => {
        console.log(authData);
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

}
