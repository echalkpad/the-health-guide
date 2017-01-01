// Angular
import { Injectable } from '@angular/core';

// Telerik
import { SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';

@Injectable()
export class DrawerService {
    public drawer: SideDrawerType;

    public toggle(force?: boolean) {
        if (this.drawer) {
            if (typeof force !== 'undefined') {
                if (force === false) {
                    this.drawer.closeDrawer();
                } else {

                }
            } else {
                this.drawer.toggleDrawerState();
            }
        }
    }
}