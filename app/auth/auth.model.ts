export class Auth {
    constructor(
        public id: string = "0",
        public avatar: string = "https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/user-avatars%2Fuser.png?alt=media&token=601592ad-d88f-4052-adc7-e5b18f0e74ce",
        public name: string = "user",
        public email: string = "user@domain.com"
    ) { }
}