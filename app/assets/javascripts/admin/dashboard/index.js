/**
 * 设置模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var angularHighcharts = require('angular-highcharts');

    var dashboard = angular.module('dashboard', [angularHighcharts.name]);

    dashboard.seajsController(require('./controller/index'));

    dashboard.factory(require('./factory/dashboard'));


    module.exports = dashboard;
});