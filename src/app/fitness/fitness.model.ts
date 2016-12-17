import { Nutrition } from '../nutrition/shared/nutrition.model';
import { User } from '../auth/user.model';

export class Fitness extends User {
    constructor(
        public ageInterval: string = "1-3 years",
        public bmi: any = {
            data: 0,
            normal: true
        },
        public bmr: number = 0,
        public dailyRequirements: Nutrition = new Nutrition(),
        public fatPercentage: any = {
            data: 0,
            normal: true
        },
        public neck: number = 38,
        public hips: number = 80,
        public waist: number = 75
    ) {
        super();
    }
}
