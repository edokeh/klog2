/**
 * Markdown 编辑器
 */
define(function (require, exports, module) {
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

    var Editor = ['Attach', '$modal', '$parse', function (Attach, $modal, $parse) {
        var preview = true;

        return {
            /**
             * 创建编辑、预览的逻辑
             * @param $scope
             * @param options  {src: 'blog.content', dest: 'htmlContent'}
             */
            addPreviewFn: function ($scope, options) {
                var setter = $parse(options.dest).assign;

                // 监控变化生成预览
                $scope.$watch(options.src, function (value) {
                    if (preview) {
                        marked(value, function (err, data) {
                            setter($scope, data);
                        });
                    }
                });

                // 防止误操作
                $scope.$on('$locationChangeStart', function (e) {
                    var content = $scope.$eval(options.src);  // 如果长度小于 minlength 为 undefined
                    if (content && !confirm('确定要离开？')) {
                        e.preventDefault();
                    }
                });
            },

            /**
             * 停止监控
             */
            stopPreview: function () {
                preview = false;
            },

            startPreview: function () {
                preview = true;
            },

            /**
             * 提供附件上传的功能，对于模板本身有一些要求
             * @param $scope
             */
            addAttachFn: function ($scope, parent) {
                // 上传
                $scope.doUpload = function (files) {
                    _.each(files, function (file) {
                        var attach = Attach.create({originalFile: file});
                        parent.attaches.push(attach);
                    });
                    $scope.attachShow = true;
                };

                $scope.removeAttach = function (attach) {
                    attach.$remove(function () {
                        parent.attaches = _.without(parent.attaches, attach);
                        if (parent.attaches.length === 0) {
                            $scope.attachShow = false;
                        }
                    });
                };

                $scope.showTip = function () {
                    $modal.open({
                        templateUrl: 'editor/tip',
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.modal = $modalInstance;
                        }]
                    });
                };
            }
        };
    }];

    module.exports = {Editor: Editor};
});