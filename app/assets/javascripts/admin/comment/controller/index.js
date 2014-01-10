/**
 * 评论列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Comment', 'Confirm', function($scope, Comment, Confirm) {

        // 根据页数获取 blog 列表
        $scope.getComments = function(cursor) {
            $scope.comments = Comment.query({cursor: cursor}, function(data) {
            });
        };

        // 显示某一篇 blog 详情
        $scope.showBlog = function(blog) {
            $scope.currBlog = blog;
            blog.$get({detail: true});
        };

        // 删除 blog
        $scope.remove = function(blog) {
            Confirm.open('确定要删除“' + blog.title + '”？').then(function() {
                blog.$remove(function() {
                    $scope.blogs = _.without($scope.blogs, blog);
                    $scope.currBlog = $scope.blogs[0];
                });
            });
        };

        // scroll 到底部时载入下一页
        $scope.$watch('listScrollTop', function(value) {
            if (value >= 0.95 && $scope.page.hasNext) {
                $scope.getBlogs($scope.page.current + 1);
            }
        });

        //$scope.comments = [];
        $scope.getComments();
    }];

    IndexController.title = '评论列表';

    module.exports = IndexController;
});