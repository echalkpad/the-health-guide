import { CovalentCoreModule, TD_LOADING_ENTRY_COMPONENTS } from '@covalent/core';
import { CovalentChipsModule } from '@covalent/chips';
import { CovalentFileModule } from '@covalent/file-upload';
import { CovalentChartsModule } from '@covalent/charts';
import { CovalentDataTableModule } from '@covalent/data-table';
import { CovalentPagingModule } from '@covalent/paging';
import { CovalentSearchModule } from '@covalent/search';

export const thirdPartyImports = [
    CovalentCoreModule.forRoot(),
    CovalentChipsModule.forRoot(),
    CovalentDataTableModule.forRoot(),
    CovalentFileModule.forRoot(),
    CovalentPagingModule.forRoot(),
    CovalentSearchModule.forRoot(),
];

export const thirdPartyEntries = [
    TD_LOADING_ENTRY_COMPONENTS
];