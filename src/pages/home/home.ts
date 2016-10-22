import { Component, OnInit } from '@angular/core';
import { AngularFire } from "angularfire2";

import { NavController } from 'ionic-angular';

import { FileUploadService } from '../../providers';

@Component({
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';
  public benchmark: string;
  materials: Array<any> = [
    { 'id': 1, 'name': 'Acrylic (Transparent)', 'quantity': '25', 'price': '$2.90' },
    { 'id': 2, 'name': 'Plywood (Birch)', 'quantity': '50', 'price': '$1.25' },
    { 'id': 3, 'name': 'Laminate (Gold on Blue)', 'quantity': '10', 'price': '$2.35' }
  ]
  pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 24
  };
  availableLength: Array<number> = [5, 10, 20];
  pagedMaterials: Array<any> = [];

  constructor(private fileSvc: FileUploadService, private navCtrl: NavController, public af: AngularFire) {
    this.refreshMaterials();
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  refreshMaterials() {
    let start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage,
      end = start + this.pagination.itemsPerPage;
    this.pagedMaterials = this.materials.slice(start, end);
  }
  detectChange(event) {
    if (event !== undefined && event.name === 'pagination_changed' && event.pagination !== undefined) {
      this.pagination = event.pagination;
      this.refreshMaterials();
    }
  }

  ngOnInit(): void {
    console.log("Welcome home");
    this.fileSvc.getBenchmarck().subscribe(
      data => {
        this.benchmark = data._body.toString();
        console.log(this.benchmark.split("\n"));
      },
      error => console.error('Error: ' + error),
      () => console.log('Completed!')
    );
  }
}
