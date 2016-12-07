import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Auth } from './auth/auth.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private handle: number;
  public auth: Auth = new Auth("", "", "");
  public routeLinks: Object[];

  constructor(private authSvc: AuthService, private router: Router) {
    this.routeLinks = [
      {
        title: "Home", route: "/home", icon: "home"
      },
      {
        title: "Nutrition", route: "/nutrition", icon: "spa"
      }
    ];
  }

  private checkAuth(): void {
    if (this.authSvc.getAuthData()) {
      this.auth = Object.assign({}, this.authSvc.getAuthData());
      clearInterval(this.handle);
    }
  }

  public logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    if (!this.authSvc.getAuthData()) {
      this.handle = setInterval(() => this.checkAuth(), 3000);
    } else {
      this.auth = Object.assign({}, this.authSvc.getAuthData());
    }
  }

}
