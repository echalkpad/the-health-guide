import { ActivityTrackComponent } from '../../activity-track/activity-track.component';
import { ActivityTrackDataService } from '../../activity-track/activity-track-data.service';
import { ActivityTrackResolve } from '../../activity-track/activity-track-resolve.service';
import { ActivityTrackService } from '../../activity-track/activity-track.service';
import { DataService } from '../../shared/data.service';
import { FitnessComponent } from '../../fitness.component';
import { FitnessProfileComponent } from '../../fitness-profile/fitness-profile.component';
import { FitnessProfileResolve } from '../../fitness-profile/fitness-profile-resolve.service';
import { FitnessRoutingModule } from '../../fitness-routing.module';
import { FitnessService } from '../../fitness.service';
import { MealTrackComponent } from '../../meal-track/meal-track.component';
import { MealTrackDataService } from '../../meal-track/meal-track-data.service';
import { MealTrackResolve } from '../../meal-track/meal-track-resolve.service';
import { MealTrackService } from '../../meal-track/meal-track.service';

export const fitnessDeclarations = [
    ActivityTrackComponent,
    FitnessComponent,
    FitnessProfileComponent,
    MealTrackComponent
];

export const fitnessImports = [FitnessRoutingModule];

export const fitnessProviders = [
    ActivityTrackDataService,
    ActivityTrackResolve,
    ActivityTrackService,
    DataService,
    FitnessService,
    FitnessProfileResolve,
    MealTrackDataService,
    MealTrackResolve,
    MealTrackService
];