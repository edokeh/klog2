/**
 * 页面列表
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    var IndexController = ['$scope', 'Editor', 'Page', 'Confirm', 'ErrorMessage', '$timeout', function($scope, Editor, Page, Confirm, ErrorMessage, $timeout) {
        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';

        Editor.stopPreview();
        Editor.addPreviewFn($scope, {
            src: 'currPage.content',
            dest: 'currPage.html_content'
        });

        ErrorMessage.extend({
            page: {
                title: {
                    required: '标题不能为空',
                    minlength: '标题至少2个字'
                },
                content: {
                    required: '内容不能为空',
                    minlength: '内容至少3个字'
                }
            }
        });

        $scope.pages = Page.query(function(data) {
            // 自动选中一篇
            if ($scope.pages.length > 0) {
                $scope.showPage($scope.pages[0]);
            }
        });

        // 显示某一篇页面详情
        $scope.showPage = function(page) {
            $scope.currPage = page;
            if (!page) {
                return;
            }
            if (!page.id) {
                $scope.startEdit();
                return;
            }
            page.$get({detail: true});
            $scope.cancelEdit();
        };

        // 修改
        $scope.startEdit = function() {
            $scope.editing = true;
            $scope.serverError = null;
            Editor.startPreview();
            Editor.addAttachFn($scope, $scope.currPage);
        };

        $scope.cancelEdit = function() {
            $scope.editing = false;
            Editor.stopPreview();
            // 退出编辑新建的页面时，删除它
            if (!$scope.currPage.id) {
                $scope.pages = _.without($scope.pages, $scope.currPage);
                $scope.showPage($scope.pages[0]);
            }
        };

        // 新增
        $scope.add = function() {
            // 避免重复
            var newPage = _.findWhere($scope.pages, {id: undefined});
            if (!newPage) {
                newPage = new Page({
                    title: '新页面',
                    content: '',
                    attaches: []
                });
                $scope.pages.push(newPage);
            }
            $scope.showPage(newPage);
        };

        $scope.save = function(e) {
            // 显示报错
            var showError = function() {
                $timeout(function() {
                    $scope.errorTrigger = angular.element(e.target.submitBtn);
                });
            };

            if ($scope.form.$valid) {
                $scope.currPage.$save(function() {
                    $scope.cancelEdit();
                }, function(resp) {
                    $scope.serverError = resp.data.errors;
                    showError();
                });
            }
            else {
                showError();
            }
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

        // 排序
        $scope.up = function(page, e) {
            e.stopPropagation();
            page.$up(function() {
                var index = _.indexOf($scope.pages, page);
                $scope.pages[index] = $scope.pages[index - 1];
                $scope.pages[index - 1] = page;
            });
        };

        $scope.down = function(page, e) {
            e.stopPropagation();
            page.$down(function() {
                var index = _.indexOf($scope.pages, page);
                $scope.pages[index] = $scope.pages[index + 1];
                $scope.pages[index + 1] = page;
            });
        };
    }];

    IndexController.title = '页面列表';
    IndexController.nav = 'page';

    module.exports = IndexController;
});