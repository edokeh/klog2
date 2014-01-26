define(function(require, exports, module) {
    var angular = require('angularjs');
    var bootstrap = require('bootstrap');
    var ajaxSpinner = require('./ajax-spinner');
    var validation = require('./validation');

    var common = angular.module('common', [
        bootstrap.name,
        ajaxSpinner.name,
        validation.name
    ]);

    common.controller(require('./controller/nav'));

    common.factory(require('./factory/attach'));
    common.factory(require('./factory/blog'));
    common.factory(require('./factory/category'));
    common.factory(require('./factory/page'));
    common.factory(require('./factory/confirm'));
    common.factory(require('./factory/flash'));

    common.directive(require('./directive/popover'));
    common.directive(require('./directive/scroll-top-percent'));
    common.directive(require('./directive/loading-btn'));
    common.directive(require('./directive/file-input'));

    module.exports = common;
});