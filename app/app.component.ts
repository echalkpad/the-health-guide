// Angular
import { Component, OnInit } from "@angular/core";

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// THG
import { DataService } from './shared';

@Component({
    selector: 'thg-app',
    template: '<page-router-outlet></page-router-outlet>'
})
export class AppComponent implements OnInit {
    
    constructor(private _dataSvc: DataService, private _router: RouterExtensions) { }

    ngOnInit(): void {
        if (!this._dataSvc.getAuth()) {
            this._router.navigate(['/login']);
        }
    }
}
