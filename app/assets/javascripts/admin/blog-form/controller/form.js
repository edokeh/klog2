/**
 * 编辑或新建 blog
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    var Controller = ['$scope', 'Blog', 'Category', '$routeParams', '$location', 'Flash', 'Editor', 'RelativeUrlFactory', '$timeout', 'ErrorMessage', function($scope, Blog, Category, $routeParams, $location, Flash, Editor, RelativeUrlFactory, $timeout, ErrorMessage) {

        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.categories = Category.query();
        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';
        $scope.CSRF_TOKEN = window.CSRF_TOKEN;

        // 编辑 or 新建
        if ($routeParams.id) {
            $scope.blog = Blog.get({id: $routeParams.id, detail: true});
        }
        else {
            $scope.blog = new Blog({
                content: '',
                status: 1,
                attaches: []
            });
        }

        ErrorMessage.extend({
            blog: {
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

        // 保存
        $scope.save = function(e) {
            e.preventDefault();

            // 显示报错
            var showError = function() {
                $timeout(function() {
                    $scope.errorTrigger = angular.element(e.target.submitBtn);
                });
            };

            if ($scope.form.$valid) {
                $scope.blog.$save(function() {
                    Flash.tmp($scope.blog.id);
                    $location.url('/blog?status=' + $scope.blog.status);
                }, function(resp) {
                    $scope.serverError = resp.data.errors;
                    showError();
                });
            }
            else {
                showError();
            }
        };

        // 服务器渲染的预览
        $scope.preview = function() {
            document.getElementById('blogForm').submit();
        };

        // 防止误操作
        $scope.$on('$locationChangeStart', function(e) {
            if ($scope.blog.content && !confirm('确定要离开？')) {
                e.preventDefault();
            }
        });

        // 插入代码
        $scope.insertCode = function(attach) {
            $scope.attachShow = false;

            var text = ' ' + attach.getCode() + ' ';
            var cursor = $scope.contentSel.cursor();
            var content = $scope.blog.content;
            $scope.blog.content = [content.slice(0, cursor[0]), text, content.slice(cursor[1])].join('');
            var end = cursor[0] + text.length;
            $scope.contentSel.cursor(end);
        };

        Editor.addPreviewFn($scope, {
            src: 'blog.content',
            dest: 'htmlContent'
        });

        Editor.addAttachFn($scope, $scope.blog);

    }];

    Controller.title = '写文章';
    Controller.nav = 'blog-form';

    module.exports = Controller;
});