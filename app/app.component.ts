import {Component} from "@angular/core";

import firebase = require("nativescript-plugin-firebase");

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBXdSjoVfk1KbbtmAUEq7ktnnI70ojg4y8",
  authDomain: "the-health-guide.firebaseapp.com",
  databaseURL: "https://the-health-guide.firebaseio.com",
  storageBucket: "the-health-guide.appspot.com",
  messagingSenderId: "283336744173"
};


firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}).then(
  (instance) => {
    console.log("firebase.init done");
  },
  (error) => {
    console.log("firebase.init error: " + error);
  }
);

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public counter: number = 16;

    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }
    
    public onTap() {
        this.counter--;
    }
}
