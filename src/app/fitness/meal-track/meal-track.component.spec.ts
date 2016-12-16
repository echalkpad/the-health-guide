/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MealTrackComponent } from './meal-track.component';

describe('MealTrackComponent', () => {
  let component: MealTrackComponent;
  let fixture: ComponentFixture<MealTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
