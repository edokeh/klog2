/**
 * 为元素添加 drop file 的功能
 * <div file-drop="fn(files)" accept=".jpg, .png" hover-class="dragover"></div>
 */
define(function(require, exports, module) {
    var _ = require('_');

    // 拖拽事件中是否有文件
    function hasFile(event) {
        return _.contains(event.originalEvent.dataTransfer.types, 'Files');
    }

    // 为元素绑定 draghover 事件
    function bindDragHover(el, fn) {
        var dragged = 0;
        el.on('dragenter', function(e) {
            dragged++;
            fn(e);
        });

        el.on('dragleave', function(e) {
            dragged--;
            if (!dragged) {
                fn(e);
            }
        });
    }

    module.exports = {
        'fileDrop': ['$document', function($document) {
            return {
                restrict: 'CA',
                scope: {
                    fileDrop: '&',
                    accept: '@',
                    hoverClass: '@'
                },
                link: function(scope, element, attrs) {
                    // 校验类型的正则 /[^\s]+(\.(jpg|zip|pdf))$/i
                    var typeReg;
                    if (scope.accept) {
                        var types = _.map((scope.accept || '').split(','), function(i) {
                            return i.trim().substr(1);
                        });
                        typeReg = new RegExp('[^\\s]+(\\.(' + types.join('|') + '))$', 'i');
                    }
                    else {
                        typeReg = /.*/i;
                    }

                    var hoverClass = scope.hoverClass || 'dragover';

                    // 拖动文件到 document 时显示 Drop 框
                    bindDragHover($document, function(e) {
                        element.toggle(e.type === 'dragenter' && hasFile(e));
                    });

                    // 拖动文件到 Drop 框时高亮
                    bindDragHover(element, function(e) {
                        element.toggleClass(hoverClass, e.type === 'dragenter');
                    });

                    // 设置鼠标样式
                    $document.on('dragover', setCursorFn('none'));
                    element.on('dragover', setCursorFn('copy'));

                    // drop file
                    element.on('drop', function(e) {
                        e.preventDefault();
                        element.removeClass('dragover');
                        $document.trigger('dragleave');

                        var files = _.filter(e.originalEvent.dataTransfer.files, function(file) {
                            return typeReg.test(file.name);
                        });

                        scope.$apply(function() {
                            scope.fileDrop({files: files});
                        });
                    });

                    // 销毁时解除绑定
                    element.on('$destroy', function() {
                        $document.off('dragenter');
                        $document.off('dragleave');
                        $document.off('dragover');
                    });

                    function setCursorFn(type) {
                        return function(e) {
                            if (hasFile(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.originalEvent.dataTransfer.dropEffect = type;
                            }
                        };
                    }
                }
            };
        }]
    };
});