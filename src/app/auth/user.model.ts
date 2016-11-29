export class User {
    constructor(
        public id: string = "",
        public name: string = "",
        public email: string = "",
        public password: string = "",
        public avatar: string = "",
        public age: number = 1,
        public gender: string = "",
        public weight: number = 1,
        public height: number = 1,
        public infancy: boolean = false,
        public pregnancy: boolean = false,
        public lactation: boolean = false,
        public isLoggedIn: boolean = false
    ) { }
}