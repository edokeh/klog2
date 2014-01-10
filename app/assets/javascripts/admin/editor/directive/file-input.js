/**
 * 为元素提供类似 input[type=file] 的功能，点击后出现上传框
 * 示例 <a file-input="do(files)" accept=".jpg, .png"></a>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        'fileInput': [function() {
            return {
                restrict: 'CA',
                scope: {
                    fileInput: '&',
                    accept: '@'
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
                        createInput.fileInput = angular.element('<input class="ng-hide" type="file" multiple accept="' + scope.accept + '" />');
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