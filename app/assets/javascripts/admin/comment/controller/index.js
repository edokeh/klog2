/**
 * 评论列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Comment', 'Confirm', function($scope, Comment, Confirm) {

        // 获取评论列表
        $scope.getComments = function(cursor) {
            $scope.comments = Comment.query({cursor: cursor}, function(data) {
                $scope.cursor = data.$cursor.next;
            });
        };

        // 显示某一篇评论上下文
        $scope.showComment = function(comment) {
            $scope.currComment = comment;

            $scope.commentContext = Comment.getContext({comment_id: comment.id});
        };

        // 删除评论
        $scope.remove = function(event, comment) {
            event.stopPropagation();
            Confirm.open('确定要删除这条评论？').then(function() {
                comment.$remove(function() {
                    $scope.comments = _.without($scope.comments, comment);
                    //$scope.currBlog = $scope.blogs[0];
                });
            });
        };

        $scope.newComment = new Comment();
        $scope.create = function(){
            $scope.newComment.parent = $scope.currComment.id;
            $scope.newComment.$save();
        };

        $scope.closeCurr = function(){
            $scope.currComment = null;
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