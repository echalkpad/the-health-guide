import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { DataService } from './shared';

@Component({
    selector: 'thg-app',
    template: '<page-router-outlet></page-router-outlet>'
})
export class AppComponent implements OnInit {
    
    constructor(private dataSvc: DataService, private router: Router) { }

    ngOnInit(): void {
        if (!this.dataSvc.getAuth()) {
            this.router.navigate(['/login']);
        }
    }
}
