/**
 * 设置模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var setting = angular.module('setting', []);

    setting.seajsController(require('./controller/disqus'));
    setting.seajsController(require('./controller/category'));
    setting.seajsController(require('./controller/password'));
    setting.seajsController(require('./controller/website'));
    setting.seajsController(require('./controller/attach'));
    setting.seajsController(require('./controller/ga'));

    setting.factory(require('./factory/website'));
    setting.factory(require('./factory/password'));
    setting.factory(require('./factory/disqus'));
    setting.factory(require('./factory/ga'));

    setting.directive(require('./directive/ng-equal-to'));

    module.exports = setting;
});