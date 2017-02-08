// Angular
import { Injectable } from '@angular/core';

// RxJS
import { BehaviorSubject, Observable } from 'rxjs';

// Firebase
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';

// THG
import { Auth, User } from '../model';
import { DataService } from '../../shared';

@Injectable()
export class AuthService {
  private _avatars: firebase.storage.Reference;
  public redirectUrl: string;
  constructor(private _af: AngularFire, private _dataSvc: DataService) {
    this._avatars = firebase.storage().ref().child('/avatars');
  }

  public getUser$(id: string): FirebaseObjectObservable<User> {
    return this._af.database.object(`/users/${id}`);
  }

  public getAvatar(imgName: string): firebase.Promise<any> {
    return this._avatars.child(`${imgName}`).getDownloadURL();
  }

  public getAuth(): Promise<Auth> {
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        resolve(this._dataSvc.getAuth())
      } else {
        reject(null);
      }
    });
  }

  public isLoggedIn(): boolean {
    return !!this._dataSvc.getAuth();
  }

  public login(credentials: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._af.auth.login({
        email: credentials.email,
        password: credentials.password
      }).then((authData: FirebaseAuthState) => {
        if (!!authData) {
          this.getUser$(authData.uid).subscribe((data: User) => {
            this._dataSvc.saveAuth(new Auth(authData.uid, data.avatar, data.username));
            this._dataSvc.saveUser(data);
            resolve(true);
          });
        }
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  public logout(): Promise<void> {
    this._dataSvc.removeAuth();
    this._dataSvc.removeUser();
    return this._af.auth.logout();
  }

  public signUp(credentials: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._af.auth.createUser({
        email: credentials.email,
        password: credentials.password
      }).then((authData: FirebaseAuthState) => {
        if (!!authData) {
          this.getAvatar(credentials.avatar).then((url: string) => {
            credentials.avatar = url;
            this.getUser$(authData.uid).set(credentials);
            this._dataSvc.saveAuth(new Auth(authData.uid, credentials.avatar, credentials.username));
            this._dataSvc.saveUser(credentials);
            resolve(true);
          }).catch(err => reject(err));
        }
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  public saveUser(id: string, user: User): void {
    delete user['$key'];
    delete user['$exists'];
    this.getUser$(id).update(user);
  }

  public uploadAvatar(img: File): firebase.storage.UploadTask {
    return this._avatars.child(img.name).put(img);
  }

}
