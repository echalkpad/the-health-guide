export class Nutrient {
    constructor(
        public id: number,
        public name: string,
        public unit: string,
        public value: number = 0
    ) { }
}

export class Nutrition {
    constructor(
        public water: Nutrient = new Nutrient(255, 'Water', 'g'),
        public energy: Nutrient = new Nutrient(208, 'Energy', 'kcal'),
        public protein: Nutrient = new Nutrient(203, 'Protein', 'g'),
        public fats: Nutrient = new Nutrient(204, 'Fats', 'g'),
        public carbs: Nutrient = new Nutrient(205, 'Carbohydrates', 'g'),
        public fiber: Nutrient = new Nutrient(291, 'Fiber', 'g'),
        public sugars: Nutrient = new Nutrient(269, 'Sugars', 'g'),
        public calcium: Nutrient = new Nutrient(301, 'Calcium', 'mg'),
    ) {  }

    public setWaterValue(value: number): void {
        this.water.value = value;
    }

    public setEnergyValue(value: number): void {
        this.energy.value = value;
    }

    public setProteinValue(value: number): void {
        this.protein.value = value;
    }

    public setFatsValue(value: number): void {
        this.fats.value = value;
    }

    public setCarbsValue(value: number): void {
        this.carbs.value = value;
    }

    public setFiberValue(value: number): void {
        this.fiber.value = value;
    }

    public setSugarsValue(value: number): void {
        this.sugars.value = value;
    }

    public setCalciumValue(value: number): void {
        this.sugars.value = value;
    }
}
