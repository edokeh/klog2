/**
 * BLOG 模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var blog = angular.module('blog', []);

    blog.seajsController(require('./controller/index'));

    module.exports = blog;
});