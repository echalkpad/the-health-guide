import { ActivityTrackComponent } from '../../activity-track/activity-track.component';
import { DataService } from '../../shared/data.service';
import { FitnessComponent } from '../../fitness.component';
import { FitnessRoutingModule } from '../../fitness-routing.module';
import { MealTrackComponent } from '../../meal-track/meal-track.component';
import { MealTrackDataService } from '../../meal-track/meal-track-data.service';
import { MealTrackResolve } from '../../meal-track/meal-track-resolve.service';
import { MealTrackService } from '../../meal-track/meal-track.service';

export const fitnessDeclarations = [ActivityTrackComponent, FitnessComponent, MealTrackComponent];

export const fitnessImports = [FitnessRoutingModule];

export const fitnessProviders = [
    DataService,
    MealTrackDataService,
    MealTrackResolve,
    MealTrackService
];