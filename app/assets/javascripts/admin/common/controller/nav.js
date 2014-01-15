define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = {
        nav: ['$scope', '$location', 'Confirm', '$http', '$rootScope', function($scope, $location, Confirm, $http, $rootScope) {
            $scope.navItems = [
                {
                    name: '文章',
                    ico: 'fa-files-o',
                    url: '/blog',
                    nav: 'blog'
                },
                {
                    name: '写文章',
                    ico: 'fa-pencil',
                    url: '/blog/new',
                    nav: 'blog-form'
                },
                {
                    name: '评论',
                    ico: 'fa-comments',
                    url: '/comment',
                    nav: 'comment'
                },
                {
                    name: '页面',
                    ico: 'fa-link',
                    url: '/page',
                    nav: 'page'
                },
                {
                    name: '设置',
                    ico: 'fa-cogs',
                    url: '/setting/website',
                    nav: 'setting'
                }
            ];

            $scope.$on('$routeChangeSuccess', function() {
                _.each($scope.navItems, function(item) {
                    item.active = item.nav === $rootScope.nav;
                });
            });

            $scope.logout = function() {
                Confirm.open('确定要退出后台？').then(function() {
                    $http.delete('/admin/session').success(function() {
                        location.href = '/admin/session/new';
                    });
                });
            };
        }]
    };

});
