// Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// THG
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authSvc: AuthService, private _router: Router) { }

  public canActivate(): boolean {
    if (this._authSvc.getAuth()) {
      return true;
    }
    this._router.navigate(['/login']);
    return false;
  }
}