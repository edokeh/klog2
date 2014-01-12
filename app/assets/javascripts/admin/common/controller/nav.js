define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = {
        nav: ['$scope', '$location', function($scope, $location) {
            $scope.navItems = [
                {
                    name: '写文章',
                    ico: 'fa-pencil',
                    url: '/blog/new'
                },
                {
                    name: '文章',
                    ico: 'fa-file-text',
                    url: '/blog'
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
        }]
    };

});
