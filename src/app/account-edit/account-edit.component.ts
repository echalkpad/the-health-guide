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
    private accountSvc: AccountEditService,
    private authSvc: AuthService,
    private dialogSvc: TdDialogService,
    private route: ActivatedRoute,
    private toast: MdSnackBar
  ) { }

  private showError(msg: string | Error): void {
    this.dialogSvc.openAlert({
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
            return this.dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

  public updateAccount(): void {
    this.accountSvc.updateAccount(this.user)
      .then(() => this.toast.open('Update success!', 'OK'))
      .catch((res: any) => this.showError(res));
  }

  public uploadAvatar(img: File): void {
        this.authSvc.uploadAvatar(img).then(() => {
            this.user.avatar = img.name; this.toast.open('Upload complete!', 'OK');
        });
    }

  ngOnInit(): void {
    this.route.data.subscribe((data: { account: User }) => {
      this.user = data.account;
    });
  }

}
