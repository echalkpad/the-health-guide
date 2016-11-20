import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { FirebaseListObservable } from 'angularfire2';
import { TdDataTableSortingOrder } from '@covalent/data-table';

import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {
  public columns: Object[];
  public data: any[] = [];
  public pageSize: number = 10;
  public sortBy: string = 'name';
  public sortOrder: string = 'ASC';
  constructor(
    private foodSvc: FoodService,
    private route: ActivatedRoute,
    private router: Router,
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

  public selectedRow(row: any): void {
    console.log(row);
  }

  public sortChanged(changes: any): void {
    const { column, order }: any = changes;
    this.sortBy = column.name;
    this.sortOrder = order === TdDataTableSortingOrder.Ascending ? 'ASC' : 'DESC';
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { foods: Food[] }) => {
      console.log(data);
      if (!!data) {
        this.data = [...data.foods];
      }
    });
    this.titleSvc.setTitle("Food list");
  }

}
