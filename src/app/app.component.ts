import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public routeLinks: Object[] = [
    {
      title: "Home", route: "/", icon: "home"
    }, {
      title: "Nutrition", route: "/nutrition", icon: "spa"
    }
  ];

  constructor() { }


}
