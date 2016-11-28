export class User {
    constructor(
        public id: string = "",
        public name: string = "",
        public email: string = "",
        public password: string = "",
        public avatar: string = "",
        public age: number = 0,
        public female: boolean = false,
        public male: boolean = false,
        public weight: number = 0,
        public height: number = 0,
        public infancy: boolean = false,
        public pregnancy: boolean = false,
        public lactation: boolean = false,
        public isLoggedIn: boolean = false
    ) { }
}