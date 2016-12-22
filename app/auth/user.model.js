"use strict";
var User = (function () {
    function User(name, email, password, avatar, age, gender, weight, height, infancy, pregnancy, lactation) {
        if (name === void 0) { name = ""; }
        if (email === void 0) { email = ""; }
        if (password === void 0) { password = ""; }
        if (avatar === void 0) { avatar = "user.png"; }
        if (age === void 0) { age = 1; }
        if (gender === void 0) { gender = ""; }
        if (weight === void 0) { weight = 1; }
        if (height === void 0) { height = 1; }
        if (infancy === void 0) { infancy = false; }
        if (pregnancy === void 0) { pregnancy = false; }
        if (lactation === void 0) { lactation = false; }
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.age = age;
        this.gender = gender;
        this.weight = weight;
        this.height = height;
        this.infancy = infancy;
        this.pregnancy = pregnancy;
        this.lactation = lactation;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map