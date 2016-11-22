import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table';
import { IPageChangeEvent } from '@covalent/paging';

import { Food } from '../shared/food.model';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {
  public columns: Object[];
  public currentPage: number = 1;
  public data: any[] = [];
  public filteredData: any[] = [];
  public filteredTotal: number = 0;
  public fromRow: number = 1;
  public pageSize: number = 5;
  public searchTerm: string = '';
  public sortBy: string = 'name';
  public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  constructor(
    private dataTableSvc: TdDataTableService,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) {
    this.columns = [
      { name: 'name', label: 'Food' },
      { name: 'energy', label: 'Energy (kcal)', numeric: true },
      { name: 'Protein', label: 'Protein (g)', numeric: true },
      { name: 'Carbohydrates', label: 'Carbs (g)', numeric: true },
      { name: 'Sugars', label: 'Sugars (g)', numeric: true },
      { name: 'Fiber', label: 'Fiber (g)', numeric: true },
      { name: 'Fats', label: 'Fat (g)', numeric: true },
      { name: 'Saturated fat', label: 'Saturated fat (g)', numeric: true },
      { name: 'Monounsaturated fat', label: 'Monounsaturated fat (g)', numeric: true },
      { name: 'Polyunsaturated fat', label: 'Polyunsaturated fat (g)', numeric: true }
    ];
  }

  private filter(): void {
    let newData: any[] = this.data;
    newData = this.dataTableSvc.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this.dataTableSvc.sortData(newData, this.sortBy, this.sortOrder);
    newData = this.dataTableSvc.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  public openDetails(ev: { item: Food }): void {
    console.log(ev.item);
  }

  public search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  public page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  public sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { foods: Food[] }) => {
      console.log(data);
      if (!!data) {
        this.data = [...data.foods];
        this.filter();
      }
    });
    this.titleSvc.setTitle("Food list");
  }

}
