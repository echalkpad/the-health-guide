import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  constructor(private titleSvc: Title) { }

    ngAfterViewInit(): void {
    this.titleSvc.setTitle("Home");
  }

}
