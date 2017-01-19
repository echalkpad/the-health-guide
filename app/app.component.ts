// THG
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Nativescript
import { TNSFontIconService } from 'nativescript-ng2-fonticon';

@Component({
    selector: 'thg-app',
    template: '<page-router-outlet></page-router-outlet>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(private fonticon: TNSFontIconService) { }
}
