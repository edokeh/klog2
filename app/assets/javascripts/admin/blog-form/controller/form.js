/**
 * 编辑或新建 blog
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Blog', 'Category', '$routeParams', '$location', 'Flash', 'Editor', 'RelativeUrl', function($scope, Blog, Category, $routeParams, $location, Flash, Editor, RelativeUrl) {

        $scope.relativeUrl = RelativeUrl(module);
        $scope.categories = Category.query();
        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';

        // 编辑 or 新建
        if ($routeParams.id) {
            $scope.blog = Blog.get({id: $routeParams.id});
        }
        else {
            $scope.blog = new Blog({
                content: '',
                status: 1,
                attaches: []
            });
        }

        $scope.save = function(isPublish) {
            if ($scope.form.$valid) {
                $scope.blog.$save(function() {
                    Flash.tmp($scope.blog.id);
                    $location.url('/blogs');
                });
            }
        };

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

        Editor.addAttachFn($scope);

    }];

    Controller.title = '写文章';

    module.exports = Controller;
});