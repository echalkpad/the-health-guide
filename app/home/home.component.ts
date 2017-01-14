// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// THG
import { DrawerService } from '../shared';

@Component({
    moduleId: module.id,
    selector: 'thg-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    constructor(private _changeDetectionRef: ChangeDetectorRef, public drawerSvc: DrawerService) { }

    ngOnInit(): void {
        this._changeDetectionRef.detectChanges();
    }
}