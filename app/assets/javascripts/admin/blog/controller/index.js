/**
 * 文章列表
 */
define(function (require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', '$routeParams', 'Blog', function ($scope, $routeParams, Blog, Confirm, Flash) {

        $scope.STATUS = Blog.STATUS;
        //$scope.currStatus = Blog.getStatus($routeParams.status);

        $scope.blogs = [];

        $scope.getBlogs = function (page) {
            Blog.query({
                status: $routeParams.status,
                page: page
            }, function (data) {
                $scope.blogs = $scope.blogs.concat(data);
                $scope.isLast = data.isLast;
                $scope.currentPage = data.currentPage;
                if ($scope.blogs.length > 0) {
                    //var tmpId = Flash.tmp();
                    //var blog = tmpId ? _.findWhere($scope.blogs, {id: tmpId}) : $scope.blogs[0];
                    //$scope.showBlog(blog);
                }
            });
        };

        $scope.showBlog = function (blog) {
            $scope.currBlog = blog;
            blog.$get({detail: true});
        };

        $scope.remove = function (blog) {
            Confirm.open('确定要删除“' + blog.title + '”？').then(function () {
                blog.$remove(function () {
                    $scope.blogs = _.without($scope.blogs, blog);
                    $scope.currBlog = $scope.blogs[0];
                });
            });
        };

        // 到底载入更多
        $scope.$watch('listScrollTop', function (value) {
            if (value >= 0.9 && !$scope.isLast) {
                $scope.getBlogs($scope.currentPage + 1);
            }
        });

        $scope.getBlogs(1);
    }];

    IndexController.title = '文章列表';

    module.exports = IndexController;
});