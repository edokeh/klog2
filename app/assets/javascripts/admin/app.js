define(function(require, exports, module) {
    var angular = require('angularjs');
    var SeajsLazyAngular = require('angular/seajs-lazy-angular/0.0.1/seajs-lazy-angular');
    var common = require('./common/index');

    var admin = angular.module('admin', [common.name]);

    admin.config(SeajsLazyAngular.cacheInternals);
    SeajsLazyAngular.patchAngular();
    SeajsLazyAngular.setResolveCallback(['$rootScope', 'controller', function($rootScope, controller) {
        $rootScope.title = controller.title + ' - Klog 后台管理';
    }]);

    admin.config(['$routeProvider', function($routeProvider) {

        var blog = SeajsLazyAngular.createLazyStub('/assets/admin/blog/index');

        $routeProvider
            .when('/blogs', blog.createRoute('./controller/index'))
            .otherwise({redirectTo: '/blogs'});
    }]);

    angular.bootstrap(window.document, ['admin']);
});