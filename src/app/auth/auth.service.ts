import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';

import { Auth } from './auth.model';
import { DataService } from '../shared/data.service';
import { User } from './user.model';

@Injectable()
export class AuthService {
  private _userAvatars: firebase.storage.Reference;
  public redirectUrl: string;
  constructor(private _af: AngularFire, private _dataSvc: DataService) {
    this._userAvatars = firebase.storage().ref().child('/user-avatars');
  }

  public getAvatar(imgName: string): firebase.Promise<any> {
    return this._userAvatars.child(`${imgName}`).getDownloadURL();
  }

  public getAuthData(): Promise<firebase.User> {
    return new Promise(resolve => {
      this._af.auth.subscribe((authData: FirebaseAuthState) => {
        if (!!authData) {
          resolve(authData.auth);
        }
      });
    });
  }

  public getAuth(): Auth {
    return this._dataSvc.getAuth();
  }

  public getUserData(userId: string): FirebaseObjectObservable<User> {
    return this._af.database.object(`/users/${userId}`);
  }

  public login(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this._af.auth.login({
        email: credentials.email,
        password: credentials.password
      }).then((authData: FirebaseAuthState) => {
        if (!!authData) {
          this.getUserData(authData.uid).subscribe((data: User) => {
            this._dataSvc.saveAuth(new Auth(authData.uid, data.avatar, data.name));
            this._dataSvc.saveUser(data);
            resolve(true);
          });
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  public logout(): void {
    this._dataSvc.removeAuth();
    this._dataSvc.removeUser();
    this._af.auth.logout();
  }

  public signUp(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this._af.auth.createUser({
        email: credentials.email,
        password: credentials.password
      }).then((authData: FirebaseAuthState) => {
        if (!!authData) {
          this.getAvatar(credentials.avatar).then((url: string) => {
            credentials.avatar = url;
            this.getUserData(authData.uid).set(credentials);
            this._dataSvc.saveAuth(new Auth(authData.uid, credentials.avatar, credentials.name));
            this._dataSvc.saveUser(credentials);
            resolve(true);
          }).catch(err => reject(err));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  public saveUserData(authId: string, user: User): void {
    delete user['$key'];
    delete user['$exists'];
    this.getUserData(authId).update(user);
  }

  public uploadAvatar(img: File): firebase.storage.UploadTask {
    return this._userAvatars.child(img.name).put(img);
  }

}
