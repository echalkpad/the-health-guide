export class Nutrition {
    constructor(
        public energy: number = 0,
        public Water: number = 0,
        public Protein: number = 0,
        public Carbohydrates: number = 0,
        public Sugars: number = 0,
        public Fiber: number = 0,
        public Fats: number = 0,
        public satFat: number = 0,
        public monounsatFat: number = 0,
        public polyunsatFat: number = 0,
        public transFat: number = 0,
        public minerals: any = {
            "Calcium": 0,
            "Copper": 0,
            "Flouride": 0,
            "Iron": 0,
            "Magnesium": 0,
            "Manganese": 0,
            "Phosphorus": 0,
            "Potassium": 0,
            "Selenium": 0,
            "Sodium": 0,
            "Zinc": 0
        },
        public vitamins: any = {
            "Vitamin A": 0,
            "Vitamin B1": 0,
            "Vitamin B2": 0,
            "Vitamin B3": 0,
            "Vitamin B5": 0,
            "Vitamin B6": 0,
            "Vitamin B9": 0,
            "Folic acid": 0,
            "Choline": 0,
            "Betaine": 0,
            "Vitamin B12": 0,
            "Vitamin C": 0,
            "Vitamin D2": 0,
            "Vitamin D3": 0,
            "Vitamin E": 0,
            "Vitamin K": 0,
            "alpha-Lipoic acid": 0
        },
        public aminoacids: any = {
            "Arginine": 0,
            "Cysteine": 0,
            "Glutamine": 0,
            "Glycine": 0,
            "Histidine": 0,
            "Isoleucine": 0,
            "Leucine": 0,
            "Lysine": 0,
            "Methionine": 0,
            "Phenylalanine": 0,
            "Proline": 0,
            "Serine": 0,
            "Threonine": 0,
            "Tryptophan": 0,
            "Tyrosine": 0,
            "Valine": 0
        }
    ) {
        this["amino acids"] = aminoacids;
        delete this.aminoacids;
        this["Saturated fat"] = satFat;
        delete this.satFat;
        this["Monounsaturated fat"] = monounsatFat;
        delete this.monounsatFat;
        this["Polyunsaturated fat"] = polyunsatFat;
        delete this.polyunsatFat;
        this["Trans fat"] = transFat;
        delete this.transFat;
    }
}

export class Food extends Nutrition {
    constructor(
        public name: string = "",
        public category: string = "",
        public energy: number = 0,
        public quantity: number = 100
    ) {
        super();
        this.name = "";
    }
}