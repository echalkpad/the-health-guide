import { Injectable } from '@angular/core';

import { DataService } from '../shared/data.service';
import { Fitness } from '../fitness.model';
import { Meal, MealTime, MealTracker, MealTrackNutrition } from './meal-tracker.model';
import { Nutrient } from '../../nutrition/nutrients/shared/nutrient.model';
import { NutrientService } from '../../nutrition/nutrients/shared/nutrient.service';
import { Nutrition } from '../../nutrition/shared/nutrition.model';

@Injectable()
export class MealTrackService {

  constructor(private dataSvc: DataService, private nutrientSvc: NutrientService) { }

  private getMealTrackNutrition(mealTrack: MealTracker): MealTrackNutrition {
    let mtNutrition: MealTrackNutrition = new MealTrackNutrition();
    mealTrack.mealTimes.forEach((mt: MealTime) => {
      for (let nutrientCategory in mt.nutrition) {
        let nutrients: number | Object = mt.nutrition[nutrientCategory];
        if (typeof nutrients === 'number') {
          mtNutrition[nutrientCategory] += nutrients;
        } else if (typeof nutrients === 'object') {
          for (let nutrient in nutrients) {
            mtNutrition[nutrientCategory][nutrient] += nutrients[nutrient];
          }
        }
      }
    });

    return mtNutrition;
  }

  private getNutritionRequirements(): Promise<MealTrackNutrition> {
    return new Promise(resolve => {
      let energyConsumption: number = this.dataSvc.getEnergyConsumption() || 0,
        fit: Fitness = this.dataSvc.getFitness();
      fit.dailyRequirements.Energy = fit.bmr + energyConsumption - 200;
      // Set macronutrient requirements
      this.nutrientSvc.getMacronutrients().subscribe((nutrients: Nutrient[]) => {
        if (!!nutrients && !!nutrients.length) {
          nutrients.forEach((nutrient: Nutrient) => {
            if (nutrient.name === 'Amino acids') {
              nutrient.classification.forEach((subNutrient: Nutrient) => {
                if (fit.dailyRequirements['amino acids'].hasOwnProperty(subNutrient.name) && subNutrient.hasOwnProperty('intake')) {
                  if (fit.gender === 'female') {
                    if (fit.pregnancy) {
                      fit.dailyRequirements['amino acids'][subNutrient.name] = subNutrient.intake.female.pregnancy[fit.ageInterval] * fit.weight;
                    } else if (fit.lactation) {
                      fit.dailyRequirements['amino acids'][subNutrient.name] = subNutrient.intake.female.lactation[fit.ageInterval] * fit.weight;
                    } else {
                      fit.dailyRequirements['amino acids'][subNutrient.name] = subNutrient.intake.female.normal[fit.ageInterval] * fit.weight;
                    }
                  } else {
                    fit.dailyRequirements['amino acids'][subNutrient.name] = subNutrient.intake.male[fit.ageInterval] * fit.weight;
                  }
                }
              });
            }
          });
        }

        // These nutrients are relative to the daily energy consumption
        fit.dailyRequirements.Water = fit.dailyRequirements.Energy;
        fit.dailyRequirements.Protein = (fit.dailyRequirements.Energy * 0.2) / 4.1;
        fit.dailyRequirements.Carbohydrates = (fit.dailyRequirements.Energy * 0.45) / 4.1;
        fit.dailyRequirements.Sugars = (fit.dailyRequirements.Energy * 0.15) / 4.1;
        fit.dailyRequirements.Fats = (fit.dailyRequirements.Energy * 0.35) / 9;
        fit.dailyRequirements.Fiber = (fit.dailyRequirements.Energy * 0.015);
        fit.dailyRequirements['Monounsaturated fat'] = (fit.dailyRequirements.Energy * 0.2) / 9;
        fit.dailyRequirements['Polyunsaturated fat'] = (fit.dailyRequirements.Energy * 0.15) / 9;
        fit.dailyRequirements['Saturated fat'] = (fit.dailyRequirements.Energy * 0.15) / 9;
        fit.dailyRequirements['Omega-3 fatty acids'] = (fit.dailyRequirements.Energy * 0.1) / 9;
        fit.dailyRequirements['Omega-6 fatty acids'] = (fit.dailyRequirements.Energy * 0.05) / 9;
      });

      // Set micronutrient requirements
      this.nutrientSvc.getMicronutrients().subscribe((nutrients: Nutrient[]) => {
        if (!!nutrients && !!nutrients.length) {
          nutrients.forEach((nutrient: Nutrient) => {
            if (fit.dailyRequirements.vitamins.hasOwnProperty(nutrient.name) && nutrient.hasOwnProperty('intake')) {
              if (fit.gender === 'female') {
                if (fit.pregnancy) {
                  fit.dailyRequirements.vitamins[nutrient.name] = nutrient.intake.female.pregnancy[fit.ageInterval];
                } else if (fit.lactation) {
                  fit.dailyRequirements.vitamins[nutrient.name] = nutrient.intake.female.lactation[fit.ageInterval];
                } else {
                  fit.dailyRequirements.vitamins[nutrient.name] = nutrient.intake.female.normal[fit.ageInterval];
                }
              } else {
                fit.dailyRequirements.vitamins[nutrient.name] = nutrient.intake.male[fit.ageInterval];
              }

              if (nutrient.name === 'Vitamin D') {
                if (fit.gender === 'female') {
                  if (fit.pregnancy) {
                    fit.dailyRequirements.vitamins['Vitamin D3'] = fit.dailyRequirements.vitamins['Vitamin D2'] = nutrient.intake.female.pregnancy[fit.ageInterval];
                  } else if (fit.lactation) {
                    fit.dailyRequirements.vitamins['Vitamin D3'] = fit.dailyRequirements.vitamins['Vitamin D2'] = nutrient.intake.female.lactation[fit.ageInterval];
                  } else {
                    fit.dailyRequirements.vitamins['Vitamin D3'] = fit.dailyRequirements.vitamins['Vitamin D2'] = nutrient.intake.female.normal[fit.ageInterval];
                  }
                } else {
                  fit.dailyRequirements.vitamins['Vitamin D3'] = fit.dailyRequirements.vitamins['Vitamin D2'] = nutrient.intake.male[fit.ageInterval];
                }
              }
            } else if (fit.dailyRequirements.minerals.hasOwnProperty(nutrient.name) && nutrient.hasOwnProperty('intake')) {
              if (fit.gender === 'female') {
                if (fit.pregnancy) {
                  fit.dailyRequirements.minerals[nutrient.name] = nutrient.intake.female.pregnancy[fit.ageInterval];
                } else if (fit.lactation) {
                  fit.dailyRequirements.minerals[nutrient.name] = nutrient.intake.female.lactation[fit.ageInterval];
                } else {
                  fit.dailyRequirements.minerals[nutrient.name] = nutrient.intake.female.normal[fit.ageInterval];
                }
              } else {
                fit.dailyRequirements.minerals[nutrient.name] = nutrient.intake.male[fit.ageInterval];
              }
            }
          });
        }
      });

      setTimeout(() => {
        this.dataSvc.saveFitness(fit);
        resolve(fit.dailyRequirements);
      }, 10000);
    });
  }

  public getMealTimeNutrition(mealTime: MealTime): MealTrackNutrition {
    let mtNutrition: MealTrackNutrition = new MealTrackNutrition();
    if (mealTime.meals.length > 0) {
      mealTime.meals.forEach((meal: Meal) => {
        if (meal.hasOwnProperty('nutrition')) {
          // The meal is a recipe
          mtNutrition.quantity = Math.floor(mtNutrition.quantity + meal.amount * meal.quantity);
          for (let nutrientCategory in meal.nutrition) {
            let nutrients = meal.nutrition[nutrientCategory];
            if (typeof nutrients === 'number') {
              mtNutrition[nutrientCategory] = Math.floor(mtNutrition[nutrientCategory] + nutrients * meal.amount);
            } else if (typeof nutrients === 'object') {
              for (let nutrient in nutrients) {
                mtNutrition[nutrientCategory][nutrient] = Math.floor(
                  mtNutrition[nutrientCategory][nutrient] + nutrients[nutrient] * meal.amount
                );
              }
            }
          }
        } else {
          // The meal is a basic food
          mtNutrition.quantity = Math.floor(mtNutrition.quantity + meal.quantity);
          for (let nutrientCategory in meal) {
            let nutrients = meal[nutrientCategory];
            if (typeof nutrients === 'number' && nutrientCategory !== 'quantity') {
              mtNutrition[nutrientCategory] = Math.floor(
                mtNutrition[nutrientCategory] + nutrients * (meal.quantity / 100)
              );
            } else if (typeof nutrients === 'object') {
              for (let nutrient in nutrients) {
                mtNutrition[nutrientCategory][nutrient] = Math.floor(
                  mtNutrition[nutrientCategory][nutrient] + nutrients[nutrient] * (meal.quantity / 100)
                );
              }
            }
          }
        }
      });
    }

    return mtNutrition;
  }

  public setMealTrackNutrition(mt: MealTracker): Promise<MealTrackNutrition> {
    return new Promise(resolve => {
      let remainingNutrition: MealTrackNutrition = new MealTrackNutrition();
      mt.nutrition = this.getMealTrackNutrition(mt);
      console.log("Total nutrition:", mt.nutrition);
      this.getNutritionRequirements().then((requiredNutrition: MealTrackNutrition) => {
        console.log("Required nutrition:", requiredNutrition);
        for (let nutrientCategory in requiredNutrition) {
          let reqNutrients = requiredNutrition[nutrientCategory],
            totalNutrients = mt.nutrition[nutrientCategory];
          if (typeof reqNutrients === 'number') {
            if (!!reqNutrients) {
              remainingNutrition[nutrientCategory] = Math.floor((totalNutrients / reqNutrients) * 100);
            } else {
              remainingNutrition[nutrientCategory] = !totalNutrients ? 100 : 100 + totalNutrients;
            }
          }
          for (let nutrient in reqNutrients) {
            if (reqNutrients[nutrient] > 0) {
              remainingNutrition[nutrientCategory][nutrient] = Math.floor((totalNutrients[nutrient] / reqNutrients[nutrient]) * 100);
            } else {
              remainingNutrition[nutrientCategory][nutrient] = !totalNutrients[nutrient] ? 100 : 100 + totalNutrients[nutrient];
            }
          }
        }
        console.log("Remaining nutrition", remainingNutrition);
        resolve(remainingNutrition);
      });
    });
  }

}
