/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import FoodModule from './food.module';

describe('FoodModule', () => {
  let foodModule;

  beforeEach(() => {
    foodModule = new FoodModule();
  });

  it('should create an instance', () => {
    expect(foodModule).toBeTruthy();
  })
});
