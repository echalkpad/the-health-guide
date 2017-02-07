export class Nutrient {
    constructor(
        public id: number,
        public group: string,
        public name: string,
        public unit: string,
        public value: number = 0
    ) { }
}

export class Nutrition {
    constructor(
        public water: Nutrient = new Nutrient(255, 'Proximates', 'Water', 'g'),
        public energy: Nutrient = new Nutrient(208, 'Proximates', 'Energy', 'kcal'),
        public protein: Nutrient = new Nutrient(203, 'Proximates', 'Protein', 'g'),
        public fats: Nutrient = new Nutrient(204, 'Proximates', 'Fats', 'g'),
        public carbs: Nutrient = new Nutrient(205, 'Proximates', 'Carbohydrates', 'g'),
        public fiber: Nutrient = new Nutrient(291, 'Proximates', 'Fiber', 'g'),
        public sugars: Nutrient = new Nutrient(269, 'Proximates', 'Sugars', 'g'),
        public calcium: Nutrient = new Nutrient(301, 'Minerals', 'Calcium', 'mg'),
        public iron: Nutrient = new Nutrient(303, 'Minerals', 'Iron', 'mg'),
        public magnesium: Nutrient = new Nutrient(304, 'Minerals', 'Magnesium', 'mg'),
        public phosphorus: Nutrient = new Nutrient(305, 'Minerals', 'Phosphorus', 'mg'),
        public potassium: Nutrient = new Nutrient(306, 'Minerals', 'Potassium', 'mg'),
        public sodium: Nutrient = new Nutrient(307, 'Minerals', 'Sodium', 'mg'),
        public zinc: Nutrient = new Nutrient(309, 'Minerals', 'Zinc', 'mg'),
        public copper: Nutrient = new Nutrient(312, 'Minerals', 'Copper', 'mg'),
        public manganese: Nutrient = new Nutrient(315, 'Minerals', 'Manganese', 'mg'),
        public selenium: Nutrient = new Nutrient(317, 'Minerals', 'Selenium', 'ug'),
        public vitaminC: Nutrient = new Nutrient(401, 'Vitamins', 'Vitamin C', 'mg'),
        public vitaminB1: Nutrient = new Nutrient(404, 'Vitamins', 'Vitamin B1', 'mg')
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

    public setIronValue(value: number): void {
        this.sugars.value = value;
    }

    public setMagnesiumValue(value: number): void {
        this.magnesium.value = value;
    }

    public setPhosphorusValue(value: number): void {
        this.phosphorus.value = value;
    }

    public setPotassiumValue(value: number): void {
        this.potassium.value = value;
    }

    public setSodiumValue(value: number): void {
        this.sodium.value = value;
    }

    public setZincValue(value: number): void {
        this.zinc.value = value;
    }

    public setCopperValue(value: number): void {
        this.copper.value = value;
    }

    public setManganeseValue(value: number): void {
        this.manganese.value = value;
    }

    public setSeleniumValue(value: number): void {
        this.selenium.value = value;
    }

    public setVitaminCValue(value: number): void {
        this.vitaminC.value = value;
    }

    public setVitaminB1Value(value: number): void {
        this.vitaminB1.value = value;
    }
}
