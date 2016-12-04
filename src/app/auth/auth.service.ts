// TODO: add users database in firebase

import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import { Auth } from './auth.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  private userAvatars: firebase.storage.Reference;
  public redirectUrl: string;
  constructor(private af: AngularFire) {
    this.userAvatars = firebase.storage().ref().child('/user-avatars');
  }

  public getAvatar(imgName: string): firebase.Promise<any> {
    return this.userAvatars.child(`${imgName}`).getDownloadURL();
  }

  public getAuthData(): Auth {
    return JSON.parse(localStorage.getItem('auth'));
  }

  public getUserData(userId: string): FirebaseObjectObservable<User> {
    return this.af.database.object(`/users/${userId}`);
  }

  public login(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.login({
        email: credentials.email,
        password: credentials.password
      }).then(authData => {
        this.getUserData(authData.uid).subscribe((data: User) => localStorage.setItem('auth', JSON.stringify(new Auth(authData.uid, data.avatar, data.name))));
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public logout(): void {
    this.af.auth.logout();
    localStorage.removeItem('auth');
  }

  public signUp(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.createUser({
        email: credentials.email,
        password: credentials.password
      }).then(authData => {
        this.getAvatar(credentials.avatar).then((url: string) => {
          credentials.avatar = url;
          this.getUserData(authData.uid).set(credentials);
          localStorage.setItem('auth', JSON.stringify(new Auth(authData.uid, credentials.avatar, credentials.name)));
          resolve(true);
        }).catch(err => reject(err))
      }).catch(error => {
        reject(error);
      });
    });
  }

  public uploadAvatar(img: File): void {
    this.userAvatars.child(img.name).put(img).then(snapshot => console.log('Uploaded successfully'));
  }

}
