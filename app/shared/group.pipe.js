"use strict";
var core_1 = require('@angular/core');
var GroupPipe = (function () {
    function GroupPipe() {
    }
    GroupPipe.prototype.transform = function (value, columns, colNr) {
        if (value) {
            return value.filter(function (item, index) {
                if (index % columns === colNr - 1) {
                    return item;
                }
            });
        }
    };
    GroupPipe = __decorate([
        core_1.Pipe({
            name: 'group'
        }), 
        __metadata('design:paramtypes', [])
    ], GroupPipe);
    return GroupPipe;
}());
exports.GroupPipe = GroupPipe;
//# sourceMappingURL=group.pipe.js.map