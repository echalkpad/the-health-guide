/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MacronutrientResolveService } from './macronutrient-resolve.service';

describe('Service: MacronutrientResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MacronutrientResolveService]
    });
  });

  it('should ...', inject([MacronutrientResolveService], (service: MacronutrientResolveService) => {
    expect(service).toBeTruthy();
  }));
});
