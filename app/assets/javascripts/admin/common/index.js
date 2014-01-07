define(function(require, exports, module) {
    var angular = require('angularjs');
    var ngAnimate = require('angular-animate');
    var ngResource = require('angular-resource');
    var ngRoute = require('angular-route');
    var ngSanitize = require('angular-sanitize');

    var common = angular.module('common', [
        ngAnimate.name,
        ngRoute.name,
        ngResource.name,
        ngSanitize.name,
    ]);

    common.factory(require('./factory/blog'));

    module.exports = common;
});