import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
@Injectable()
export class CapitalizePipe {
  transform(value: string = '') {
    value = value + ''; // make sure it's a string
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
