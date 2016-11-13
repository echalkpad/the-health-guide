import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.sass']
})
export class AppComponent implements OnInit {
    public message: string;

    ngOnInit(): void {
        this.message = "Hello World";
    }
}
