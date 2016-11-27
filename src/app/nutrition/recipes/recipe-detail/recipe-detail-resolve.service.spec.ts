/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecipeDetailResolve } from './recipe-detail-resolve.service';

describe('Service: RecipeDetailResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeDetailResolve]
    });
  });

  it('should ...', inject([RecipeDetailResolve], (service: RecipeDetailResolve) => {
    expect(service).toBeTruthy();
  }));
});
