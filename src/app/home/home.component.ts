import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Auth } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public auth: Auth;
  constructor(private authSvc: AuthService, private titleSvc: Title) { }

  ngOnInit(): void {
    this.auth = Object.assign({}, this.authSvc.getAuth());
    this.titleSvc.setTitle("Home");
  }

}
