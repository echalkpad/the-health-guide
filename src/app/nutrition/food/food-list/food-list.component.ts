import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TdDialogService, TdLoadingService } from '@covalent/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table';
import { IPageChangeEvent } from '@covalent/paging';

import { DataService } from '../../shared/data.service';
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements AfterViewInit, OnInit {
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
    private _dataSvc: DataService,
    private _dataTableSvc: TdDataTableService,
    private _dialogSvc: TdDialogService,
    private _foodSvc: FoodService,
    private _loadingSvc: TdLoadingService,
    private _router: Router,
    private _titleSvc: Title
  ) {

    this.columns = [
      { name: 'name', label: 'Food' },
      { name: 'Energy', label: 'Energy (kcal)', numeric: true },
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

  private _filter(): void {
    let newData: any[] = this.data;
    newData = this._dataTableSvc.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableSvc.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableSvc.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  private _showAlert(): void {
    this._dialogSvc.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    }).afterClosed().subscribe(() => this._router.navigate(['/nutrition']));
  }

  public openDetails(ev: { row: Food }): void {
    this._dataSvc.saveFood(ev.row);
    this._router.navigate(['/nutrition/food', ev.row.$key]);
  }

  public search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this._filter();
  }

  public page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this._filter();
  }

  public sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this._filter();
  }

  ngAfterViewInit(): void {
    this._loadingSvc.register('food.load');
    setTimeout(() => {
      this._loadingSvc.resolve('food.load');
      if (!this.data.length) {
        this._showAlert();
      }
    }, 5000);
    this._titleSvc.setTitle("Foods");
  }

  ngOnInit(): void {
    this._foodSvc.getFoods().subscribe((data: Food[]) => {
      if (!!data && !!data.length) {
        this.data = [...data];
        this._filter();
        this._loadingSvc.resolve('food.load');
      }
    }
    );
  }

}
