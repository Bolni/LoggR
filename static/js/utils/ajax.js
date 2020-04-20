"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var AjaxUtil = /** @class */ (function () {
    function AjaxUtil(url) {
        var _this = this;
        this.url = url;
        this.ajax = function (method, cb, data) {
            $.ajax({
                url: _this.url,
                method: method,
                contentType: "application/json; charset=utf-8",
                data: (data) ? JSON.stringify(data) : undefined
            }).done(function (response) {
                //alert(response)
                if (cb)
                    cb(response);
            }).fail(function (jqXHR) {
                alert("ERROR " + jqXHR.statusText);
            });
        };
        this.get = function (data, cb) {
            if (!cb)
                cb = data;
            _this.ajax('GET', cb, data);
        };
        this.add = function (data, cb) {
            _this.ajax('POST', cb, data);
        };
        this.remove = function (data, cb) {
            _this.ajax('DELETE', cb, data);
        };
    }
    return AjaxUtil;
}());
exports.AjaxUtil = AjaxUtil;
//# sourceMappingURL=ajax.js.map