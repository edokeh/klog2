/**
 * 元素 scrollTop 的双向 bind
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        scrollTopPercent: function() {
            return {
                restrict: 'A',
                scope: {
                    scrollTopPercent: '='
                },
                link: function(scope, element, attrs, ngModel) {
                    var ignoreEvent;
                    var ignoreWatch;

                    // scope 改变时，修改 scrollTop
                    scope.$watch('scrollTopPercent', function(value) {
                        if (angular.isUndefined(value) || ignoreWatch) {
                            ignoreWatch = false;
                            return;
                        }
                        element[0].scrollTop = value * (element[0].scrollHeight - element[0].clientHeight);
                        ignoreEvent = true;
                    });

                    // scroll 事件时修改 scope
                    element.on('scroll', function() {
                        if (ignoreEvent) {
                            ignoreEvent = false;
                            return;
                        }
                        scope.$apply(function() {
                            var scrollTopPercent = element[0].scrollTop / (element[0].scrollHeight - element[0].clientHeight);
                            scope.scrollTopPercent = scrollTopPercent;
                            ignoreWatch = true;
                        });
                    });
                }
            };
        }
    };
});