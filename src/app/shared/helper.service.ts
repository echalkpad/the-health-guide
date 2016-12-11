import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }

  public filterItems(items: any[], searchTerm: string = ''): any[] {
    return items.filter((item: any) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  }

  public paginate(data: any[], start: number, end: number): any[] {
    if (start >= 1) {
      data = data.slice(start - 1, end);
    }
    return data;
  }

  public removeHashkeys(items: any[]): void {
    items.forEach(item => {
      if (item.hasOwnProperty('$key')) {
        delete item['$key'];
      }
      if (item.hasOwnProperty('$exists')) {
        delete item['$exists'];
      }
    });
  }

  public sortByName(arr: any[]): any[] {
    return arr.sort((a, b) => {
      let x = a.name.toLowerCase(), y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

}
