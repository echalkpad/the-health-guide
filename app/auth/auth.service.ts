// Angular
import { Injectable } from '@angular/core';

// Nativescript
import * as firebase from 'nativescript-plugin-firebase';
import * as fs from "file-system";

// THG
import { Auth } from './auth.model';
import { DataService } from '../shared/data.service';
import { User } from './user.model';

@Injectable()
export class AuthService {
    public redirectUrl: string;
    constructor(private _dataSvc: DataService) {
    }

    public getAvatar(imgName: string): any {

    }

    public getAuthData(): any {
        //return this._dataSvc.getAuthData();
    }

    public getAuth(): Auth {
        return this._dataSvc.getAuth();
    }

    public getUserData(userId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            firebase.query(
                (res) => {
                    if (res.hasOwnProperty('error')) {
                        reject(res);
                    } else {
                        resolve(res);
                    }
                },
                `users/${userId}`,
                {
                    singleEvent: true,
                    orderBy: {
                        type: firebase.QueryOrderByType.KEY
                    }
                }
            );
        });

    }
    public login(credentials: { email: string, password: string }): Promise<Object> {
        return new Promise((resolve, reject) => {
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                email: credentials.email,
                password: credentials.password
            }).then((authData: firebase.User) => {
                if (!!authData) {
                    console.log(JSON.stringify(authData));
                    this._dataSvc.saveAuth(new Auth(authData.uid, authData.profileImageURL, authData.name, authData.email));
                    this.getUserData(authData.uid).then((data: User) => {
                        this._dataSvc.saveUser(data);
                        console.log(JSON.stringify(this._dataSvc.getAuth()), data);
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
        firebase.logout();
    }

    public signUp(credentials: User): Promise<boolean> {
        return new Promise((resolve, reject) => {
            firebase.createUser({
                email: credentials.email,
                password: credentials.password
            }).then((authData: firebase.CreateUserResult) => {
                if (!!authData) {
                    firebase.push(
                        `/users/${authData.key}`,
                        credentials
                    )
                    this._dataSvc.saveAuth(new Auth(authData.key, credentials.avatar, credentials.name, credentials.email));
                    this._dataSvc.saveUser(credentials);
                    resolve(true);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    public saveUserData(authId: string, user: User): void {
        delete user['$key'];
        delete user['$exists'];
        firebase.update(
            `/users/${authId}`,
            user
        );
    }

    public uploadAvatar(img: File): any {

    }

}
