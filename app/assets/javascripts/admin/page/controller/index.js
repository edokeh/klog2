/**
 * 页面列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Editor', 'Page', 'Confirm', function($scope, Editor, Page, Confirm) {

        $scope.pages = Page.query(function(data) {
            // 自动选中一篇，可能来自新建或修改页面
            if ($scope.pages.length > 0 && !$scope.currPage) {
                $scope.showPage($scope.pages[0]);
            }
        });


        // 显示某一篇页面详情
        $scope.showPage = function(page) {
            $scope.currPage = page;
            page.$get({detail: true});
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

//        Editor.addPreviewFn($scope, {
//            src: 'currPage.content',
//            dest: 'currPage.html_content'
//        });

        //Editor.addAttachFn($scope);
    }];

    IndexController.title = '页面列表';
    IndexController.nav = 'page';

    module.exports = IndexController;
});