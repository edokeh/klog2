/**
 * 设置模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var dashboard = angular.module('dashboard', []);

    dashboard.seajsController(require('./controller/index'));

    dashboard.factory(require('./factory/dashboard'));


    module.exports = dashboard;
});