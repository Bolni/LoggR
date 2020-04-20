"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ajax_1 = require("../utils/ajax");
var $ = require("jquery");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.allmodel = new ajax_1.AjaxUtil('../users/all');
        this.model = new ajax_1.AjaxUtil('../users');
        this._usersJSON = '';
        this.updater = function () {
            _this.allmodel.get(function (response) {
                if (response.success) {
                    var readJSON = JSON.stringify(response.data);
                    if (readJSON === _this._usersJSON) {
                        return;
                    }
                    _this._usersJSON = readJSON;
                    _this._users = response.data;
                    var tbody = $('#users_table').find('tbody').html('');
                    if (response.data.length === 0) {
                        tbody.append('<tr><td colspan="3">No data</td></tr>');
                    }
                    response.data.forEach(function (row) {
                        tbody.append("<tr>\n                           <td>" + row.username + "</td>\n                           <td>" + row.role + "</td>\n                           <td>" + row.date + "</td>\n                           <td>\n                               <button data-username=\"" + row.username + "\" type=\"button\" class=\"btn btn-danger remove_user\">Remove</button>\n                           </td>\n                        </tr>");
                    });
                    $('.remove_user').click(function (ev) {
                        var username = $(ev.currentTarget).attr('data-username');
                        _this.model.remove({
                            "username": username
                        }, function (result) {
                            _this.updater();
                        });
                    });
                }
            });
        };
        this.add = function (data) {
            _this.model.add(data, _this.updater);
        };
        this.remove = function (data, cb) {
            _this.model.remove(data, _this.updater);
        };
        this.updater();
        setInterval(this.updater, 5000);
    }
    Object.defineProperty(UserController.prototype, "users", {
        get: function () {
            return this._users;
        },
        enumerable: true,
        configurable: true
    });
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=User.js.map