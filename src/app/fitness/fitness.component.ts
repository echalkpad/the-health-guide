import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.scss']
})
export class FitnessComponent implements OnInit {
  public pageTitle: string = "Fitness";
  constructor() { }

  public changeTitle(title: string): void {
    this.pageTitle = title;
  }

  ngOnInit() {
  }

}
