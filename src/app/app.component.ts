import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public routeLinks: Object[] = [
    {
      title: "Food", route: "/", icon: "local_grocery_store"
    }
  ];

  constructor() { }


}
