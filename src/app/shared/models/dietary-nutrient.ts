import { Nutrient } from './nutrition';

export interface DietaryNutrient extends Nutrient {
    absorption: string;
    deficiency: Array<String>;
    excess: Array<String>;
    foodCombining: Array<String>;
    functions: Array<String>;
    sources: Array<String>;
    summary: string;
}
