"use strict";
var core_1 = require('@angular/core');
var HelperService = (function () {
    function HelperService() {
    }
    HelperService.prototype.filterItems = function (items, searchTerm) {
        if (searchTerm === void 0) { searchTerm = ''; }
        return items.filter(function (item) { return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1; });
    };
    HelperService.prototype.log10 = function (data) {
        return (Math.log(data) / Math.log(10));
    };
    HelperService.prototype.paginate = function (data, start, end) {
        if (start >= 1) {
            data = data.slice(start - 1, end);
        }
        return data;
    };
    HelperService.prototype.removeHashkeys = function (items) {
        items.forEach(function (item) {
            if (item.hasOwnProperty('$key')) {
                delete item['$key'];
            }
            if (item.hasOwnProperty('$exists')) {
                delete item['$exists'];
            }
        });
    };
    HelperService.prototype.sortByName = function (arr) {
        return arr.sort(function (a, b) {
            var x = a.name.toLowerCase(), y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
    };
    HelperService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HelperService);
    return HelperService;
}());
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map