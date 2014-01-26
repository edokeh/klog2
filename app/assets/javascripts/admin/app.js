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

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = window.CSRF_TOKEN;
        $httpProvider.defaults.headers.common['X-REQUESTED-WITH'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                'responseError': function(responseError) {
                    if (responseError.status >= 500) {
                        alert('出错啦！刷新一下吧！');
                        return $q.reject(responseError);
                    }
                    else {
                        return responseError;
                    }
                }
            };
        }]);

        var blog = SeajsLazyAngular.createLazyStub('/assets/admin/blog/index');
        var blogForm = SeajsLazyAngular.createLazyStub('/assets/admin/blog-form/index');
        var comment = SeajsLazyAngular.createLazyStub('/assets/admin/comment/index');
        var page = SeajsLazyAngular.createLazyStub('/assets/admin/page/index');
        var setting = SeajsLazyAngular.createLazyStub('/assets/admin/setting/index');

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
            .when('/setting/attach', setting.createRoute('./controller/attach', {reloadOnSearch: false}))
            .otherwise({redirectTo: '/blog'});
    }]);

    angular.bootstrap(window.document, ['admin']);
});