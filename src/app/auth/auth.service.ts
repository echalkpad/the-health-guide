import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import { Auth } from './auth.model';
import { DataService } from '../shared/data.service';
import { User } from './user.model';

@Injectable()
export class AuthService {
  private userAvatars: firebase.storage.Reference;
  public redirectUrl: string;
  constructor(private af: AngularFire, private dataSvc: DataService) {
    this.userAvatars = firebase.storage().ref().child('/user-avatars');
  }

  public getAvatar(imgName: string): firebase.Promise<any> {
    return this.userAvatars.child(`${imgName}`).getDownloadURL();
  }

  public getAuthData(): Auth {
    return this.dataSvc.getAuth();
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
        this.getUserData(authData.uid).subscribe((data: User) => {
          this.dataSvc.saveAuth(new Auth(authData.uid, data.avatar, data.name));
          this.dataSvc.saveUser(data);
          resolve(true);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  public logout(): void {
    localStorage.removeItem('auth');
    this.af.auth.logout();
  }

  public signUp(credentials: User): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.af.auth.createUser({
        email: credentials.email,
        password: credentials.password
      }).then(authData => {
        if (!!authData) {
          this.getAvatar(credentials.avatar).then((url: string) => {
            credentials.avatar = url;
            this.getUserData(authData.uid).set(credentials);
            this.dataSvc.saveAuth(new Auth(authData.uid, credentials.avatar, credentials.name));
            this.dataSvc.saveUser(credentials);
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
    return this.userAvatars.child(img.name).put(img);
  }

}
