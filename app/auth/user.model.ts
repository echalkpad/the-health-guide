export class User {
    constructor(
        public name: string = "",
        public email: string = "",
        public password: string = "",
        public avatar: string = "user.png",
        public age: number = 1,
        public gender: string = "",
        public weight: number = 1,
        public height: number = 1,
        public infancy: boolean = false,
        public pregnancy: boolean = false,
        public lactation: boolean = false
    ) { }
}