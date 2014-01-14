define(function (require, exports, module) {
    var angular = require('angularjs');
    var SeajsLazyAngular = require('angular/seajs-lazy-angular/0.0.1/seajs-lazy-angular');
    var common = require('./common/index');

    var admin = angular.module('admin', [common.name]);

    admin.config(SeajsLazyAngular.cacheInternals);
    SeajsLazyAngular.patchAngular();
    SeajsLazyAngular.setResolveCallback(['$rootScope', 'controller', function ($rootScope, controller) {
        $rootScope.title = controller.title + ' - Klog 后台管理';
    }]);

    admin.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = window.CSRF_TOKEN;
        $httpProvider.defaults.headers.common['X-REQUESTED-WITH'] = 'XMLHttpRequest';

        var blog = SeajsLazyAngular.createLazyStub('/assets/admin/blog/index');
        var blogForm = SeajsLazyAngular.createLazyStub('/assets/admin/blog-form/index');
        var comment = SeajsLazyAngular.createLazyStub('/assets/admin/comment/index');
        var setting = SeajsLazyAngular.createLazyStub('/assets/admin/setting/index');

        $routeProvider
            .when('/blog', blog.createRoute('./controller/index'))

            .when('/blog/new', blogForm.createRoute('./controller/form'))
            .when('/blog/:id/edit', blogForm.createRoute('./controller/form'))

            .when('/comment', comment.createRoute('./controller/index'))

            .when('/setting/website', setting.createRoute('./controller/website'))
            .when('/setting/password', setting.createRoute('./controller/password'))
            .when('/setting/disqus', setting.createRoute('./controller/disqus'))
            .otherwise({redirectTo: '/blog'});
    }]);

    angular.bootstrap(window.document, ['admin']);
});