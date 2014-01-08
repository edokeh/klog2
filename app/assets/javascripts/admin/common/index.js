define(function(require, exports, module) {
    var angular = require('angularjs');
    var ngAnimate = require('angular-animate');
    var ngResource = require('angular-resource');
    var ngRoute = require('angular-route');
    var ngSanitize = require('angular-sanitize');
    var bootstrap = require('angular/bootstrap/0.0.1/index');

    var common = angular.module('common', [
        ngAnimate.name,
        ngRoute.name,
        ngResource.name,
        ngSanitize.name,
        bootstrap.name
    ]);

    common.factory(require('./factory/attach'));
    common.factory(require('./factory/blog'));
    common.factory(require('./factory/category'));
    common.factory(require('./factory/flash'));

    common.directive(require('./directive/popover'));
    common.directive(require('./directive/scroll-top-percent'));

    module.exports = common;
});