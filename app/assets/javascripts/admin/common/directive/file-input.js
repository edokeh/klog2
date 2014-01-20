/**
 * 为元素提供类似 input[type=file] 的功能，点击后出现上传框
 * 示例 <a file-input="do(files)" accept=".jpg, .png" multiple="true"></a>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        'fileInput': [function() {
            return {
                restrict: 'CA',
                scope: {
                    fileInput: '&',
                    accept: '@',
                    multiple: '@'
                },
                link: function(scope, element, attrs) {

                    element.bind('click', function() {
                        var fileInput = createInput();
                        element.after(fileInput);
                        fileInput[0].click();
                    });

                    element.on('$destroy', removeFileInput);

                    // 创建 input file
                    function createInput() {
                        removeFileInput();
                        createInput.fileInput = angular.element('<input class="ng-hide" type="file" accept="' + scope.accept + '" />');
                        if (scope.multiple) {
                            createInput.fileInput.attr('multiple', 'multiple');
                        }
                        createInput.fileInput.bind('change', function(e) {
                            var fileList = e.target.files;
                            scope.$apply(function() {
                                scope.fileInput({files: fileList});
                            });
                        });
                        return createInput.fileInput;
                    }

                    function removeFileInput() {
                        if (createInput.fileInput) {
                            createInput.fileInput.remove();
                        }
                    }
                }
            };
        }]
    };
});