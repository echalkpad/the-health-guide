// Angular
import { Injectable } from '@angular/core';

// RxJs
import { Observable } from 'rxjs/Observable';

// Covalent
import { TdDialogService } from '@covalent/core';

@Injectable()
export class HelperService {

  constructor(private _dialogSvc: TdDialogService) { }

  public $showAlert(title: string, msg: string | Error): Observable<any> {
    return this._dialogSvc.openAlert({
      message: msg.toString(),
      title: title,
      closeButton: 'Got it!'
    }).afterClosed();
  }

}
