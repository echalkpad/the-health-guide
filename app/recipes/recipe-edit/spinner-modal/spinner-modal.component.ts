import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ModalDialogOptions, ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker';
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    selector: 'thg-rcp-spinner',
    templateUrl: 'spinner-modal.component.html',
    styleUrls: ['spinner-modal.component.css']
})
export class SpinnerModalComponent implements OnInit {
    public currentdate: Date;
    constructor(private _changeDetectionRef: ChangeDetectorRef, private _params: ModalDialogParams, private _page: Page) {
        this.currentdate = new Date(_params.context);
    }

    public submit() {
        let datePicker: DatePicker = <DatePicker>this._page.getViewById<DatePicker>('datePicker');
        this._params.closeCallback();
    }


    ngOnInit(): void {
        let datePicker: DatePicker = <DatePicker>this._page.getViewById<DatePicker>('datePicker');
        datePicker.year = this.currentdate.getFullYear();
        datePicker.month = this.currentdate.getMonth() + 1;
        datePicker.day = this.currentdate.getDate();
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);

        this._changeDetectionRef.detectChanges();
    }
}