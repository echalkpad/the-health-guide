import { Injectable } from '@angular/core';

export const MAX_SAFE_INTEGER: number = 900719925474099;

@Injectable()
export class HelperService {
  constructor() { }

  public filterItems(items: any[], searchQuery: string = ''): any[] {
    return items.filter((item: any) => item.name.toLocaleLowerCase().indexOf(searchQuery.toLocaleLowerCase()) !== -1);
  }

  public isMatch(item: any, query: string, searchQuery: string = ''): boolean {
    return item[query].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
  }

  public log10(data: number): number {
    return (Math.log(data) / Math.log(10));
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

}
