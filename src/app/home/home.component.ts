import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AngularFire } from "angularfire2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public avatarUrl: string;
  public username: string;
  constructor(private af: AngularFire, private titleSvc: Title) { }

  ngOnInit(): void {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.username = auth.auth.providerData[0].displayName;
        this.avatarUrl = auth.auth.providerData[0].photoURL;
      }
    });
    this.titleSvc.setTitle("Home");
  }

}
