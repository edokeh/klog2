define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = {
        nav: ['$scope', '$location', 'Confirm', '$http', function($scope, $location, Confirm, $http) {
            $scope.navItems = [
                {
                    name: '文章',
                    ico: 'fa-files-o',
                    url: '/blog'
                },
                {
                    name: '写文章',
                    ico: 'fa-pencil',
                    url: '/blog/new'
                },
                {
                    name: '评论',
                    ico: 'fa-comments',
                    url: '/comment'
                },
                {
                    name: '页面',
                    ico: 'fa-link',
                    url: '/pages'
                },
                {
                    name: '设置',
                    ico: 'fa-cogs',
                    url: '/setting/website'

                }
            ];

            $scope.$on('$routeChangeStart', function() {
                var url = $location.path();
                _.each($scope.navItems, function(item) {
                    if (item.url === url) {
                        item.active = true;
                    }
                    else {
                        item.active = false;
                    }
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
