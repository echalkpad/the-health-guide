import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { TdDialogService, TdLoadingService } from '@covalent/core';

import { AccountEditService } from './account-edit.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  @ViewChild('accountForm') accountForm: FormControl;
  public user: User;
  constructor(
    private _accountSvc: AccountEditService,
    private _authSvc: AuthService,
    private _dialogSvc: TdDialogService,
    private _route: ActivatedRoute,
    private _toast: MdSnackBar
  ) { }

  private _showError(msg: string | Error): void {
    this._dialogSvc.openAlert({
      message: msg.toString(),
      disableClose: false,
      title: 'Update failed',
      closeButton: 'Close'
    });
  }

  public canDeactivate(): Promise<boolean> | boolean {
        if (!this.accountForm.dirty) {
            return true;
        }
        return new Promise(resolve => {
            return this._dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

  public updateAccount(): void {
    this._accountSvc.updateAccount(this.user)
      .then(() => this._toast.open('Update success!', 'OK'))
      .catch((res: any) => this._showError(res));
  }

  public uploadAvatar(img: File): void {
        this._authSvc.uploadAvatar(img).then(() => {
            this.user.avatar = img.name; this._toast.open('Upload complete!', 'OK');
        });
    }

  ngOnInit(): void {
    this._route.data.subscribe((data: { account: User }) => {
      this.user = data.account;
    });
  }

}
