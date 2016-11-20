import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  
  public routeLinks: Object[] = [
    {
      title: "Home", route: "/", icon: "home"
    }, {
      title: "Nutrition", route: "/nutrition", icon: "spa"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    
  }

}
