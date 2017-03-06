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
        public vitaminB1: Nutrient = new Nutrient(404, 'Vitamins', 'Vitamin B1', 'mg'),
        public vitaminB2: Nutrient = new Nutrient(405, 'Vitamins', 'Vitamin B2', 'mg'),
        public vitaminB3: Nutrient = new Nutrient(406, 'Vitamins', 'Vitamin B3', 'mg'),
        public vitaminB5: Nutrient = new Nutrient(410, 'Vitamins', 'Vitamin B5', 'mg'),
        public vitaminB6: Nutrient = new Nutrient(415, 'Vitamins', 'Vitamin B6', 'mg'),
        public vitaminB9: Nutrient = new Nutrient(431, 'Vitamins', 'Vitamin B9', 'ug'),
        public choline: Nutrient = new Nutrient(421, 'Vitamins', 'Choline', 'mg'),
        public vitaminB12: Nutrient = new Nutrient(418, 'Vitamins', 'Vitamin B12', 'ug'),
        public vitaminA: Nutrient = new Nutrient(320, 'Vitamins', 'Vitamin A', 'ug'),
        public vitaminE: Nutrient = new Nutrient(323, 'Vitamins', 'Vitamin E', 'mg'),
        public vitaminD: Nutrient = new Nutrient(328, 'Vitamins', 'Vitamin D', 'ug'),
        public vitaminK: Nutrient = new Nutrient(329, 'Vitamins', 'Vitamin K', 'ug'),
        public satFat: Nutrient = new Nutrient(606, 'Lipids', 'Saturated fat', 'g'),
        public omega6: Nutrient = new Nutrient(618, 'Lipids', 'Omega-6', 'g'),
        public omega3: Nutrient = new Nutrient(619, 'Lipids', 'Omega-3', 'g'),
        public transFat: Nutrient = new Nutrient(605, 'Lipids', 'Trans fat', 'g'),
        public cholesterol: Nutrient = new Nutrient(601, 'Lipids', 'Cholesterol', 'mg'),
        public tryptophan: Nutrient = new Nutrient(501, 'Amino Acids', 'Tryptophan', 'g'),
        public threonine: Nutrient = new Nutrient(502, 'Amino Acids', 'Threonine', 'g'),
        public isoleucine: Nutrient = new Nutrient(503, 'Amino Acids', 'Isoleucine', 'g'),
        public leucine: Nutrient = new Nutrient(504, 'Amino Acids', 'Leucine', 'g'),
        public lysine: Nutrient = new Nutrient(505, 'Amino Acids', 'Lysine', 'g'),
        public methionine: Nutrient = new Nutrient(506, 'Amino Acids', 'Methionine', 'g'),
        public phenylalanine: Nutrient = new Nutrient(508, 'Amino Acids', 'Phenylalanine', 'g'),
        public valine: Nutrient = new Nutrient(510, 'Amino Acids', 'Valine', 'g'),
        public histidine: Nutrient = new Nutrient(512, 'Amino Acids', 'Histidine', 'g'),
        public alcohol: Nutrient = new Nutrient(221, 'Other', 'Alcohol', 'g'),
        public caffeine: Nutrient = new Nutrient(262, 'Other', 'Caffeine', 'mg'),
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

    public setVitaminB2Value(value: number): void {
        this.vitaminB2.value = value;
    }

    public setVitaminB3Value(value: number): void {
        this.vitaminB3.value = value;
    }

    public setVitaminB5Value(value: number): void {
        this.vitaminB5.value = value;
    }

    public setVitaminB6Value(value: number): void {
        this.vitaminB6.value = value;
    }

    public setVitaminB9Value(value: number): void {
        this.vitaminB9.value = value;
    }

    public setCholineValue(value: number): void {
        this.choline.value = value;
    }

    public setVitaminB12Value(value: number): void {
        this.vitaminB12.value = value;
    }

    public setVitaminAValue(value: number): void {
        this.vitaminA.value = value;
    }

    public setVitaminEValue(value: number): void {
        this.vitaminE.value = value;
    }

    public setVitaminDValue(value: number): void {
        this.vitaminD.value = value;
    }

    public setVitaminKValue(value: number): void {
        this.vitaminK.value = value;
    }

    public setSatFatValue(value: number): void {
        this.satFat.value = value;
    }

    public setOmega6Value(value: number): void {
        this.omega6.value = value;
    }

    public setOmega3Value(value: number): void {
        this.omega3.value = value;
    }

    public setTransFatValue(value: number): void {
        this.transFat.value = value;
    }

    public setCholesterolValue(value: number): void {
        this.cholesterol.value = value;
    }

    public setTryptophanValue(value: number): void {
        this.cholesterol.value = value;
    }

    public setThreonineValue(value: number): void {
        this.threonine.value = value;
    }

    public setIsoleucineValue(value: number): void {
        this.isoleucine.value = value;
    }

    public setLeucineValue(value: number): void {
        this.leucine.value = value;
    }

    public setLysineValue(value: number): void {
        this.lysine.value = value;
    }

    public setMethionineValue(value: number): void {
        this.methionine.value = value;
    }

    public setPhenylalanineValue(value: number): void {
        this.phenylalanine.value = value;
    }

    public setValineValue(value: number): void {
        this.valine.value = value;
    }

    public setHistidineValue(value: number): void {
        this.histidine.value = value;
    }

    public setAlcoholValue(value: number): void {
        this.alcohol.value = value;
    }

    public setCaffeineValue(value: number): void {
        this.caffeine.value = value;
    }
}
