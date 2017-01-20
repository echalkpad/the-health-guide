// Angular
import { Injectable, NgZone } from '@angular/core';

// Nativescript
import * as firebase from 'nativescript-plugin-firebase';
import * as fs from 'file-system';

// THG
import { Auth } from './auth.model';
import { DataService } from '../shared/data.service';
import { User } from './user.model';

@Injectable()
export class AuthService {
    public redirectUrl: string;
    constructor(private _dataSvc: DataService, private _zone: NgZone) { }

    public getAvatar(imgName: string): any {

    }

    public getAuth(): Auth {
        return this._dataSvc.getAuth();
    }

    public getUserData(): Promise<User> {
        return new Promise((resolve, reject) => {
            this._zone.runOutsideAngular(() => {
                firebase.query(
                    (res: firebase.FBData) => {
                        if (res.hasOwnProperty('error')) {
                            reject(res['error']);
                        } else {
                            resolve(res.value);
                        }
                    },
                    `/users/${this._dataSvc.getAuth().id}`,
                    {
                        singleEvent: true,
                        orderBy: {
                            type: firebase.QueryOrderByType.KEY
                        }
                    }
                );
            });
        });
    }

    public keepOnSyncUser(): void {
        firebase.keepInSync(`/users/${this._dataSvc.getAuth().id}`, true).then(
            function () {
                console.log('firebase.keepInSync is ON for /users');
            },
            function (error) {
                console.log('firebase.keepInSync error: ' + error);
            }
        );
    }

    public login(credentials: { email: string, password: string }): Promise<Object> {
        return new Promise((resolve, reject) => {
            this._zone.runOutsideAngular(() => {
                firebase.login({
                    type: firebase.LoginType.PASSWORD,
                    email: credentials.email,
                    password: credentials.password
                }).then((authData: firebase.User) => {
                    if (!!authData) {
                        //console.log(JSON.stringify(authData));
                        //this._dataSvc.saveAuth(new Auth(authData.uid, authData.profileImageURL, authData.name, authData.email));
                        this.getUserData().then((data: User) => {
                            this._dataSvc.saveUser(data);
                            resolve(true);
                        });
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public logout(): void {
        this._dataSvc.removeAuth();
        this._dataSvc.removeUser();
        firebase.logout();
    }

    public signUp(credentials: User): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._zone.runOutsideAngular(() => {
                firebase.createUser({
                    email: credentials.email,
                    password: credentials.password
                }).then((authData: firebase.CreateUserResult) => {
                    if (!!authData) {
                        firebase.push(
                            `/users/${authData.key}`,
                            credentials
                        )
                        //this._dataSvc.saveAuth(new Auth(authData.key, credentials.avatar, credentials.name, credentials.email));
                        this._dataSvc.saveUser(credentials);
                        resolve(true);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public saveUserData(authId: string, user: User): void {
        this._zone.runOutsideAngular(() => {
            delete user['$key'];
            delete user['$exists'];
            firebase.update(`/users/${authId}`, user);
        });
    }

    public uploadAvatar(img: File): any {

    }

}
