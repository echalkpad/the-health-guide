import { Nutrient } from './nutrition';

export interface DietaryNutrient extends Nutrient {
    absorption: string;
    classifications?: Array<{name: string, details: string}>;
    deficiency: Array<String>;
    excess: Array<String>;
    foodCombining?: Array<String>;
    functions: Array<String>;
    organs: Array<String>;
    sources: Array<String>;
    summary: string;
}
