import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public avatarUrl: string;
  public routeLinks: Object[];
  public username: string;

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
    if (!this.authSvc.user.isLoggedIn) {
      this.router.navigate(['/']);
    } else {
      this.username = this.authSvc.user.name;
      this.avatarUrl = this.authSvc.user.avatar;
    }
  }

}
