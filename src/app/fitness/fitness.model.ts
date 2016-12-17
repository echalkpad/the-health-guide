import { Nutrition } from '../nutrition/shared/nutrition.model';

export class Fitness {
    constructor(
        public age: number = 1,
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
        public gender: string = "",
        public height: number = 1,
        public hips: number = 80,
        public infancy: boolean = false,
        public lactation: boolean = false,
        public neck: number = 38,
        public pregnancy: boolean = false,
        public waist: number = 75,
        public weight: number = 1
    ) {  }
}
