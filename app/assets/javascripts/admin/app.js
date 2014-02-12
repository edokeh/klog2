/*global ADMIN_PATH: true, CSRF_TOKEN: true, alert: true */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var common = require('./common/index');
    var SeajsLazyAngular = require('seajs-lazy-angular');

    var admin = angular.module('admin', ['ngAll', common.name]);

    admin.config(SeajsLazyAngular.cacheInternals);
    SeajsLazyAngular.patchAngular();
    SeajsLazyAngular.setResolveCallback(['$rootScope', 'controller', function($rootScope, controller) {
        $rootScope.title = controller.title + ' - Klog 后台管理';
        $rootScope.nav = controller.nav;
    }]);

    admin.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = CSRF_TOKEN;
        $httpProvider.defaults.headers.common['X-REQUESTED-WITH'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                'responseError': function(responseError) {
                    if (responseError.status >= 500) {
                        alert('出错啦！刷新一下吧！');
                    }
                    return $q.reject(responseError);
                }
            };
        }]);

        var blog = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/blog/index');
        var blogForm = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/blog-form/index');
        var comment = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/comment/index');
        var page = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/page/index');
        var setting = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/setting/index');
        var dashboard = SeajsLazyAngular.createLazyStub(ADMIN_PATH + '/dashboard/index');

        $routeProvider
            .when('/blog', blog.createRoute('./controller/index'))

            .when('/blog/new', blogForm.createRoute('./controller/form'))
            .when('/blog/:id/edit', blogForm.createRoute('./controller/form'))

            .when('/comment', comment.createRoute('./controller/index'))

            .when('/page', page.createRoute('./controller/index'))

            .when('/setting/website', setting.createRoute('./controller/website'))
            .when('/setting/category', setting.createRoute('./controller/category'))
            .when('/setting/password', setting.createRoute('./controller/password'))
            .when('/setting/disqus', setting.createRoute('./controller/disqus'))
            .when('/setting/ga', setting.createRoute('./controller/ga'))
            .when('/setting/attach', setting.createRoute('./controller/attach', {reloadOnSearch: false}))

            .when('/dashboard', dashboard.createRoute('./controller/index'))
            .otherwise({redirectTo: '/dashboard'});
    }]);

    angular.bootstrap(window.document, ['admin']);
});