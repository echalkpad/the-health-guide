import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  transform(value: Array<any>, columns: number, colNr: number): any {
    if (value) {
      return value.filter((item, index) => {
        if (index % columns === colNr - 1) {
          return item;
        }
      });
    }
  }

}
