// Nativescript
import { SIDEDRAWER_DIRECTIVES } from 'nativescript-telerik-ui/sidedrawer/angular';
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';
import { NSFRESCO_DIRECTIVES } from 'nativescript-fresco/angular';
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';

export const thirdPartyImports = [
    TNSFontIconModule.forRoot({
        'mdi': 'material-design-icons.css'
    })
];

export const thirdPartyEntries = [
];

export const thirdPartyDeclarations = [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES,
    NSFRESCO_DIRECTIVES
];