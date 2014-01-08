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

    admin.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = window.CSRF_TOKEN;

        var blog = SeajsLazyAngular.createLazyStub('/assets/admin/blog/index');
        var blogForm = SeajsLazyAngular.createLazyStub('/assets/admin/blog-form/index');

        $routeProvider
            .when('/blog', blog.createRoute('./controller/index'))
            .when('/blog/new', blogForm.createRoute('./controller/form'))
            .when('/blog/:id/edit', blogForm.createRoute('./controller/form'))
            .otherwise({redirectTo: '/blog'});
    }]);

    angular.bootstrap(window.document, ['admin']);
});