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
  public auth: Auth;
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

  public logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.auth = Object.assign({}, this.authSvc.getAuthData());
    if (!this.auth) {
      this.router.navigate(['/']);
    }
  }

}
