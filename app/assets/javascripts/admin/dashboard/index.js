/**
 * 设置模块
 */
define(function (require, exports, module) {
    var angular = require('angularjs');
    var angularHighcharts = require('angular-highcharts');

    angularHighcharts.Highcharts.setOptions({
        lang: {
            shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        }
    });

    var dashboard = angular.module('dashboard', [angularHighcharts.name]);

    dashboard.seajsController(require('./controller/index'));

    dashboard.factory(require('./factory/dashboard'));


    module.exports = dashboard;
});