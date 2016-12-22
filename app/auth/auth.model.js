"use strict";
var Auth = (function () {
    function Auth(id, avatar, name) {
        if (avatar === void 0) { avatar = "user.png"; }
        this.id = id;
        this.avatar = avatar;
        this.name = name;
    }
    return Auth;
}());
exports.Auth = Auth;
//# sourceMappingURL=auth.model.js.map