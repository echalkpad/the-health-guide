import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFire } from "angularfire2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public avatarUrl: string;
  public routeLinks: Object[];
  public username: string;

  constructor(private af: AngularFire, private router: Router) {
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
    let navigationExtras: NavigationExtras = {
      queryParams: { 'logout': true }
    };

    this.router.navigate(['/'], navigationExtras);
    this.af.auth.logout();
  }

  ngOnInit(): void {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.username = auth.auth.providerData[0].displayName;
        this.avatarUrl = auth.auth.providerData[0].photoURL;
      }
    });
  }

}
