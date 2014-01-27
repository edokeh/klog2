/**
 * 文章列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', '$routeParams', 'Blog', 'Flash', 'Confirm', function($scope, $routeParams, Blog, Flash, Confirm) {

        var getOnce;

        // 根据页数获取 blog 列表
        $scope.getBlogs = function(page) {
            return Blog.query({
                status: $scope.currStatus.value,
                page: page
            }, function(data) {
                $scope.blogs = $scope.blogs.concat(data);
                $scope.page = data.$page;
                // 自动选中一篇，可能来自新建或修改页面
                if ($scope.blogs.length > 0 && !$scope.currBlog) {
                    var tmpId = Flash.tmp();
                    var blog = tmpId ? _.findWhere($scope.blogs, {id: tmpId}) : $scope.blogs[0];
                    $scope.showBlog(blog);
                }
                getOnce = _.once($scope.getBlogs); // 防止滚动条到底事件重复执行
            });
        };

        // 显示某一篇 blog 详情
        $scope.showBlog = function(blog) {
            $scope.currBlog = blog;
            if (!blog) {
                return;
            }
            blog.$get({detail: true});
        };

        // 删除 blog
        $scope.remove = function(blog, e) {
            e.stopPropagation();
            Confirm.open('确定要删除“' + blog.title + '”？').then(function() {
                blog.$remove(function() {
                    $scope.blogs = _.without($scope.blogs, blog);
                    if ($scope.currBlog === blog) {
                        $scope.showBlog($scope.blogs[0]);
                    }
                });
            });
        };

        // 立即发布
        $scope.publish = function(blog) {
            Confirm.open('确定要发布“' + blog.title + '”').then(function() {
                blog.$publish(function() {
                    $scope.blogs = _.without($scope.blogs, blog);
                    $scope.showBlog($scope.blogs[0]);
                });
            });
        };

        // scroll 到底部时载入下一页
        $scope.$watch('listScrollTop', function(value) {
            if (value >= 0.95 && $scope.page.hasNext) {
                getOnce($scope.page.current + 1);
            }
        });

        $scope.STATUS = Blog.STATUS;
        $scope.currStatus = Blog.getStatusText($routeParams.status);
        $scope.blogs = [];
        $scope.$promise = $scope.getBlogs(1);
    }];

    IndexController.title = '文章列表';
    IndexController.nav = 'blog';

    module.exports = IndexController;
});