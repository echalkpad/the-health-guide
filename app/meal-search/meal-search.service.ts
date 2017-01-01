import { Injectable } from '@angular/core';

import { Meal } from './meal.model';

@Injectable()
export class MealSearchService {
    private selectedMeals: Meal[];
    constructor() { }

    public getSelections(): Meal[] {
        return [] || this.selectedMeals;
    }

    public saveSelections(selections: Meal[]): void {
        this.selectedMeals = [...selections];
    }
}