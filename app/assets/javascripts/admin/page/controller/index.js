/**
 * 页面列表与编辑
 * 复杂的业务规则：
 * # 存在“编辑模式”
 * # 只能修改、删除选中的页面
 * # 同一时间，只能新建一个页面，新建页面时，立即选中并进入编辑模式
 * # 正在编辑模式时，选中其他页面，则退出编辑模式，并还原数据
 * # 退出编辑新建页面，则删除之
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
            if ($scope.editing) {
                // 退出之前的编辑模式
                $scope.stopEdit();
                if ($scope.currPage === $scope.newPage) {
                    $scope.newPage = null;
                }
                else {
                    $scope.dropUpdate();
                }
            }
            delete page.html_content; // copy 过来的 html_content 有问题
            $scope.currPage = page;
            page.$get({detail: true});
        };

        // 新增
        $scope.add = function() {
            // 避免重复
            if (!$scope.newPage) {
                $scope.newPage = new Page({
                    title: '新页面',
                    content: '',
                    attaches: []
                });
            }
            $scope.currPage = $scope.newPage;
            $scope.startEdit();
        };

        // 进入编辑模式
        var originalPage = {};
        $scope.startEdit = function() {
            $scope.editing = true;
            $scope.serverError = null;
            $scope.scrollTopPercent = 0;
            angular.copy($scope.currPage, originalPage);  // 保存备份
            Editor.startPreview();
            Editor.addAttachFn($scope, $scope.currPage);
        };

        // 退出编辑模式
        $scope.stopEdit = function() {
            $scope.editing = false;
            Editor.stopPreview();
        };

        // 放弃新建页面，并且删除它
        $scope.dropCreate = function() {
            $scope.stopEdit();
            $scope.newPage = null;
            if ($scope.pages.length > 0) {
                $scope.showPage($scope.pages[0]);
            }
        };

        // 放弃修改页面，回复数据
        $scope.dropUpdate = function() {
            $scope.stopEdit();
            angular.copy(originalPage, $scope.currPage);
        };

        // 保存
        $scope.save = function(e) {
            // 显示报错
            var showError = function() {
                $timeout(function() {
                    $scope.errorTrigger = angular.element(e.target.submitBtn);
                });
            };
            var isCreate = !$scope.currPage.id;

            if ($scope.form.$valid) {
                $scope.currPage.$save(function() {
                    // 保存成功
                    $scope.stopEdit();
                    if (isCreate) {
                        $scope.pages.push($scope.newPage);
                        $scope.newPage = null;
                    }
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
                    if ($scope.pages.length > 0) {
                        $scope.showPage($scope.pages[0]);
                    }
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