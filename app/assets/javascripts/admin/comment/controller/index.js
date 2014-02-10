/**
 * 评论列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Comment', 'Confirm', '$http', function($scope, Comment, Confirm, $http) {
        var getOnce;

        // comment 统计信息
        $scope.getCommentStat = function() {
            $http.get('/admin/dashboard/comment').then(function(resp) {
                $scope.commentStat = resp.data;
                if ($scope.commentStat.disqus_enable) {
                    $scope.getComments();
                }
            });
        };

        // 获取评论列表
        $scope.getComments = function(cursor) {
            $scope.$listPromise = Comment.query({cursor: cursor}, function(data) {
                $scope.comments = $scope.comments.concat(data);
                $scope.cursor = data.$cursor;

                if (data.length > 0 && !$scope.currComment) {
                    $scope.showComment($scope.comments[0]);
                }
                getOnce = _.once($scope.getComments);
            });
        };

        $scope.refresh = function() {
            $scope.comments = [];
            $scope.getComments();
        };

        // 显示某一篇评论上下文
        $scope.showComment = function(comment) {
            if (!comment || $scope.currComment === comment) {
                return;
            }
            $scope.currComment = comment;
            $scope.commentContext = Comment.getContext({comment_id: comment.id});
        };

        // 删除评论
        $scope.remove = function(event, comment) {
            event.stopPropagation();
            Confirm.open('确定要删除这条评论？').then(function() {
                comment.$remove(function() {
                    // 重新选一个
                    if ($scope.currComment === comment) {
                        var index = _.indexOf($scope.comments, comment);
                        index = (index === $scope.comments.length - 1) ? index - 1 : index + 1;  // 下一个 or 上一个
                        $scope.showComment($scope.comments[index]);
                    }
                    $scope.comments = _.without($scope.comments, comment);
                });
            });
        };

        // 新建回复
        $scope.newComment = new Comment();

        $scope.replayComment = function(comment) {
            $scope.showComment(comment);
            $scope.focusReply = true;
        };

        $scope.create = function() {
            if ($scope.newComment.content.trim().length === 0) {
                return;
            }
            $scope.newComment.parent = $scope.currComment.id;
            $scope.newComment.$requesting = true;
            $scope.newComment.$save(function() {
                $scope.comments.unshift($scope.newComment);
                $scope.newComment = new Comment();
            });
        };

        // ctrl + enter 快捷键回复
        $scope.shortcutCreate = function(e) {
            if (e.ctrlKey && e.which === 13) {
                $scope.create();
            }
        };

        // scroll 到底部时载入下一页
        $scope.$watch('listScrollTop', function(value) {
            if (value >= 0.95 && $scope.cursor.hasNext) {
                getOnce($scope.cursor.next);
            }
        });

        // 初始化
        $scope.comments = [];
        $scope.getCommentStat();
    }];

    IndexController.title = '评论列表';
    IndexController.nav = 'comment';

    module.exports = IndexController;
});