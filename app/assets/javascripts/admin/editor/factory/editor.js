/**
 * Markdown 编辑器
 */
define(function(require, exports, module) {
    var marked = require('gallery/marked/0.3.0/marked');
    var _ = require('_');

    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        langPrefix: 'lang-'
    });

    // 拖拽事件中是否有文件
    function hasFile(event) {
        return _.contains(event.originalEvent.dataTransfer.types, 'Files');
    }

    var Editor = ['Attach', '$modal', function(Attach, $modal) {

        return {
            /**
             * 创建编辑、预览的逻辑
             * @param $scope
             * @param options  {src: 'blog.content', dest: 'htmlContent'}
             */
            addPreviewFn: function($scope, options) {

                // 监控变化生成预览
                $scope.$watch(options.src, function(value) {
                    marked(value, function(err, data) {
                        $scope[options.dest] = data;
                    });
                });
            },

            /**
             * 提供附件上传的功能，对于模板本身有一些要求
             * @param $scope
             */
            addAttachFn: function($scope) {
                //$scope.attaches = $scope.blog.attaches;

                // 上传
                $scope.doUpload = function(files) {
                    _.each(files, function(file) {
                        var attach = Attach.create({originalFile: file});
                        $scope.blog.attaches.push(attach);
                    });
                    $scope.attachShow = true;
                };

                $scope.removeAttach = function(attach) {
                    attach.$remove(function() {
                        $scope.blog.attaches = _.without($scope.blog.attaches, attach);
                    });
                };

                // attach 对应的 Markdown code
                $scope.codeFor = function(attach) {
                    var code;
                    var url = 'http://' + location.host + attach.url;
                    if (attach.is_image) {
                        code = '![](' + url + ')';
                    }
                    else {
                        code = '[' + attach.file_name + '](' + url + ')';
                    }
                    return code;
                };

                $scope.showTip = function() {
                    $modal.open({
                        templateUrl: 'editor/tip',
                        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                            $scope.modal = $modalInstance;
                        }]
                    });
                };
            }
        };
    }];

    module.exports = {Editor: Editor};
});