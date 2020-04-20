"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ajax_1 = require("../utils/ajax");
var $ = require("jquery");
var LogController = /** @class */ (function () {
    function LogController() {
        var _this = this;
        this.model = new ajax_1.AjaxUtil('../logs');
        this._logsJSON = '';
        this.filter = [];
        this.counter = {};
        this.ctx = $("#myChart")[0].getContext('2d');
        this.updater = function () {
            _this.model.get(function (response) {
                console.log(_this);
                if (response.success) {
                    console.log(response);
                    var readJSON = JSON.stringify(response.data);
                    if (readJSON === _this._logsJSON) {
                        return;
                    }
                    _this._logsJSON = readJSON;
                    _this._logs = response.data;
                    response.data.forEach(function (log) {
                        if (!_this.counter[_this.getlevelName(log.level)])
                            _this.counter[_this.getlevelName(log.level)] = 0;
                        _this.counter[_this.getlevelName(log.level)]++;
                    });
                    _this.showtable(response.data);
                }
            });
        };
        this.add = function (data) {
            _this.model.add(data, _this.updater);
        };
        this.remove = function (data, cb) {
            _this.model.remove(data, _this.updater);
        };
        var target = $(".filter");
        target.change(function () {
            _this.filter = [];
            target.each(function (index) {
                if (target[index].checked) {
                    _this.filter.push($(target[index]).val());
                }
            });
            _this.showtable(_this._logs);
        });
        this.updater();
        setInterval(this.updater, 5000);
    }
    LogController.prototype.showtable = function (data) {
        var _this = this;
        var tbody = $('#logs_table').find('tbody').html('');
        if (data.length === 0) {
            tbody.append('<tr><td colspan="3">Nincs adat</td></tr>');
        }
        data.forEach(function (row) {
            if (_this.filter.indexOf(_this.getlevelName(row.level)) > -1 || _this.filter.length === 0) {
                tbody.append("<tr style=\"background-color:" + _this.getlevelColor(row.level) + "\">\n                    <td>" + _this.getlevelName(row.level) + "</td>\n                    <td>" + row.computerName + "</td>\n                    <td>" + new Date(row.date * 1000).toLocaleString() + "</td>\n                    <td>" + row.processName + "</td>\n                    <td>" + row.processId + "</td>\n                    <td>" + row.message + "</td>\n                    <td>\n                        <button data-id=\"" + row._id + "\" type=\"button\" class=\"btn btn-danger remove_log\">Remove</button>\n                    </td>\n                    </tr>");
            }
        });
        console.log($.map(this.counter, function (value) { return [value]; }));
        console.log(Object.keys(this.counter));
        new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(this.counter),
                datasets: [{
                        label: 'Number of logs',
                        data: $.map(this.counter, function (value) { return [value]; }),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
        $('.remove_log').click(function (ev) {
            var id = $(ev.currentTarget).attr('data-id');
            _this.remove({ _id: id }, function (result) {
                _this.updater();
            });
        });
    };
    Object.defineProperty(LogController.prototype, "logs", {
        get: function () {
            return this._logs;
        },
        enumerable: true,
        configurable: true
    });
    LogController.prototype.getlevelName = function (level) {
        switch (level) {
            case 0:
                return "Emergency";
            case 1:
                return "Alert";
            case 2:
                return "Critical";
            case 3:
                return "Error";
            case 4:
                return "Warning";
            case 5:
                return "Notice";
            case 6:
                return "Info";
            case 7:
                return "Debug";
        }
    };
    LogController.prototype.getlevelColor = function (level) {
        if (level >= 0 && level <= 3) {
            return "#dc3545";
        }
        else if (level > 3 && level <= 5) {
            return "#ffc107";
        }
        else {
            return "#28a745";
        }
    };
    return LogController;
}());
exports.LogController = LogController;
//# sourceMappingURL=Log.js.map