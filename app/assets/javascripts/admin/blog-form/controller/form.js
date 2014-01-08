/**
 * 编辑或新建 blog
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Blog', 'Category', '$routeParams', '$location', 'Flash', 'Editor', 'RelativeUrl', function($scope, Blog, Category, $routeParams, $location, Flash, Editor, RelativeUrl) {

        $scope.relativeUrl = RelativeUrl(module);
        $scope.categories = Category.query();

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

        $scope.UPLOAD_FILE_TYPES = '.jpg, .jpeg, .gif, .png, .pdf, .ppt, .pptx, .rar, .zip, .txt';

        $scope.save = function(isPublish) {
            if ($scope.form.$valid) {
                $scope.blog.$save(function() {
                    Flash.tmp($scope.blog.id);
                    $location.url('/blogs');
                });
            }
        };

        $scope.toggleConfig = function(e) {
            if ($scope.configTrigger) {
                $scope.configTrigger = null;
            }
            else {
                $scope.configTrigger = angular.element(e.currentTarget);
            }
        };

        $scope.insertCode = function(attach) {
            $scope.blog.content += $scope.codeFor(attach);
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