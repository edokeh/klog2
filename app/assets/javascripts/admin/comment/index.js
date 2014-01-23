/**
 * 设置模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var comment = angular.module('comment', []);

    comment.seajsController(require('./controller/index'));

    comment.factory(require('./factory/comment'));

    comment.directive(require('./directive/focus-if'));

    module.exports = comment;
});