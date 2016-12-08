import { NutritionModule } from '../../../nutrition/nutrition.module';
import { SharedModule } from '../../../shared/shared.module';

export const thgImports = [NutritionModule, SharedModule.forRoot()];