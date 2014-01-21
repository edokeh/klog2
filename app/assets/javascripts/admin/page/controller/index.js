/**
 * 页面列表
 */
define(function (require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', 'Editor', 'Page', 'Confirm', function ($scope, Editor, Page, Confirm) {
        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';

        $scope.pages = Page.query(function (data) {
            // 自动选中一篇，可能来自新建或修改页面
            if ($scope.pages.length > 0 && !$scope.currPage) {
                $scope.showPage($scope.pages[0]);
            }
        });

        // 显示某一篇页面详情
        $scope.showPage = function (page) {
            if (!page) {
                return;
            }
            if (!page.id) {
                $scope.add();
                return;
            }
            $scope.currPage = page;
            page.$get({detail: true});
            Editor.addAttachFn($scope, $scope.currPage);
        };

        $scope.edit = function () {
            $scope.editing = true;
            Editor.startPreview();
        };

        $scope.cancelEdit = function () {
            $scope.editing = false;
            Editor.stopPreview();
            if (!$scope.currPage.id) {
                $scope.pages = _.without($scope.pages, $scope.currPage);
                $scope.newPage = null;
                $scope.showPage($scope.pages[0]);
            }
        };

        // 新增
        $scope.add = function () {
            // 避免重复
            if (!$scope.newPage || $scope.newPage.id) {
                $scope.newPage = new Page({title: '新页面'});
                $scope.pages.push($scope.newPage);
            }
            $scope.currPage = $scope.newPage;
            $scope.editing = true;
        };

        $scope.save = function () {
            var isCreate = !!$scope.currPage.id;
            $scope.currPage.$save(function () {
                $scope.editing = false;
            });
        };

        $scope.insertCode = function (attach) {
            $scope.attachShow = false;

            var text = ' ' + attach.getCode() + ' ';
            var cursor = $scope.contentSel.cursor();
            var content = $scope.currPage.content;
            $scope.currPage.content = [content.slice(0, cursor[0]), text, content.slice(cursor[1])].join('');
            var end = cursor[0] + text.length;
            $scope.contentSel.cursor(end);
        };

        // 删除页面
        $scope.remove = function (page) {
            Confirm.open('确定要删除“' + page.title + '”？').then(function () {
                var removeCallback = function () {
                    $scope.pages = _.without($scope.pages, page);
                    $scope.showPage($scope.pages[0]);
                    $scope.editing = false;
                };

                if (page.id) {
                    page.$remove(removeCallback);
                } else {
                    removeCallback();
                    $scope.newPage = null;

                }
            });
        };

        Editor.stopPreview();
        Editor.addPreviewFn($scope, {
            src: 'currPage.content',
            dest: 'currPage.html_content'
        });

        //
        function removePage(page) {

            $scope.pages = _.without($scope.pages, page);
            $scope.showPage($scope.pages[0]);
            if (page === $scope.currPage && $scope.editing) {
                $scope.editing = false;
            }

        }
    }];

    IndexController.title = '页面列表';
    IndexController.nav = 'page';

    module.exports = IndexController;
});