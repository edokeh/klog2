/**
 * textarea 的光标位置
 * 使用了 selection 库，并将相应的对象输出方便操作
 * <textarea selection="sel"></textarea>
 */
define(function(require, exports, module) {
    var selection = require('selection');

    module.exports = {
        'selection': ['$parse', function($parse) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    if (!attrs.selection || element[0].tagName.toLowerCase() !== 'textarea') {
                        return;
                    }
                    var sel = selection(element[0]);
                    var getter = $parse(attrs.selection);

                    getter.assign(scope, sel);
                }
            };
        }]
    };
});