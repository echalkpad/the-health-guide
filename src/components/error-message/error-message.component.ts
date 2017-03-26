// App
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Providers
import { CustomValidationService } from '../../providers';

@Component({
  selector: 'error-message',
  templateUrl: 'error-message.component.html'
})
export class ErrorMessageComponent {
  @Input() control: FormControl;
  @Input() group: FormGroup;
  constructor() { }

  public get errorMessage() {
    if (this.control) {
      for (let propertyName in this.control.errors) {
        if (this.control.touched) {
          return CustomValidationService.getErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }
    }
    if (this.group) {
      for (let propertyName in this.group.errors) {
        if (this.group.touched) {
          return CustomValidationService.getErrorMessage(propertyName, this.group.errors[propertyName]);
        }
      }
    }
    
    return null;
  }

}
