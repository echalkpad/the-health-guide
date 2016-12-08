import { ActivityTrackComponent } from '../../activity-track/activity-track.component';
import { FitnessComponent } from '../../fitness.component';
import { FitnessRoutingModule } from '../../fitness-routing.module';
import { MealTrackComponent } from '../../meal-track/meal-track.component';
import { MealTrackService } from '../../meal-track/meal-track.service';

export const fitnessDeclarations = [ActivityTrackComponent, FitnessComponent, MealTrackComponent];

export const fitnessImports = [FitnessRoutingModule];

export const fitnessProviders = [MealTrackService];