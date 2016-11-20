/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NutrientListComponent } from './nutrient-list.component';

describe('NutrientListComponent', () => {
  let component: NutrientListComponent;
  let fixture: ComponentFixture<NutrientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrientListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
