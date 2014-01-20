/**
 * 页面模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var editor = require('../editor/index');

    var page = angular.module('page', [editor.name]);

    page.seajsController(require('./controller/index'));

    module.exports = page;
});