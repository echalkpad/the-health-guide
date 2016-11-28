import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public avatarUrl: string;
  public username: string;
  constructor(private authSvc: AuthService, private titleSvc: Title) { }

  ngOnInit(): void {
    this.username = this.authSvc.user.name;
    this.avatarUrl = this.authSvc.user.avatar;
    this.titleSvc.setTitle("Home");
  }

}
