/**
 * 页面列表
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Editor', 'Page', 'Confirm', function($scope, Editor, Page, Confirm) {
        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';

        $scope.pages = Page.query(function(data) {
            // 自动选中一篇，可能来自新建或修改页面
            if ($scope.pages.length > 0 && !$scope.currPage) {
                $scope.showPage($scope.pages[0]);
            }
        });

        // 显示某一篇页面详情
        $scope.showPage = function(page) {
            if (!page) {
                return;
            }
            if (!page.id) {
                $scope.add();
            }
            $scope.currPage = page;
            page.$get({detail: true});
            Editor.addAttachFn($scope, $scope.currPage);
        };

        $scope.edit = function() {
            $scope.editing = true;
        };

        $scope.cancelEdit = function() {
            $scope.editing = false;
        };

        // 新增
        $scope.add = function() {
            // 避免重复
            if (!$scope.newPage) {
                $scope.newPage = new Page({title: '新页面'});
                $scope.pages.push($scope.newPage);
            }
            $scope.currPage = $scope.newPage;
            $scope.editing = true;
        };

        $scope.save = function() {
            $scope.currPage.$save(function() {
                $scope.newPage = null;
                $scope.editing = false;
            });
        };

        $scope.insertCode = function(attach) {
            $scope.attachShow = false;

            var text = ' ' + attach.getCode() + ' ';
            var cursor = $scope.contentSel.cursor();
            var content = $scope.currPage.content;
            $scope.currPage.content = [content.slice(0, cursor[0]), text, content.slice(cursor[1])].join('');
            var end = cursor[0] + text.length;
            $scope.contentSel.cursor(end);
        };

        // 删除页面
        $scope.remove = function(page) {
            Confirm.open('确定要删除“' + page.title + '”？').then(function() {
                page.$remove(function() {
                    $scope.pages = _.without($scope.pages, page);
                    $scope.showPage($scope.pages[0]);
                });
            });
        };

        Editor.addPreviewFn($scope, {
            src: 'currPage.content',
            dest: 'currPage.html_content'
        });
    }];

    IndexController.title = '页面列表';
    IndexController.nav = 'page';

    module.exports = IndexController;
});