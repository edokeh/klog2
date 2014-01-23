/**
 * 让输入框获得焦点，当条件为真时
 * <input type="text" focus-if="focus" />
 */
define(function(require, exports, module) {
    module.exports = {
        'focusIf': ['$parse', function($parse) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var getter = $parse(attrs.focusIf);

                    scope.$watch(function() {
                        return scope.$eval(attrs.focusIf);
                    }, function(value) {
                        if (value) {
                            setTimeout(function() {
                                element[0].focus();
                            }, 200);
                            getter.assign(scope, false);
                        }
                    });
                }
            };
        }]
    };
});