define(function(require) {
    var angular = require('angularjs');
    var ngAnimate = require('angular-animate');
    var ngResource = require('angular-resource');
    var ngRoute = require('angular-route');
    var ngSanitize = require('angular-sanitize');

    var angularjsAll = angular.module('ngAll', [
        ngAnimate.name,
        ngRoute.name,
        ngResource.name,
        ngSanitize.name
    ]);

    return angular;
});