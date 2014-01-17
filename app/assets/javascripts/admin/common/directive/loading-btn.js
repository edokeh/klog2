/**
 * loading button
 * 点击后不可用并显示相应字样，满足 loading-cancel 条件时恢复
 *
 * <button loading-btn="saving" loading-cancel="success"></button>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        loadingBtn: ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                require: '?^form',
                link: function(scope, element, attrs, form) {
                    var originalHTML = element.html();

                    element.on('click', function() {

                        if (form.$valid) {
                            $timeout(function() {
                                attrs.$set('disabled', 'disabled');
                                element.text(attrs.loadingBtn || '保存中...');
                            }, 0);
                        }
                    });

                    scope.$watch(function() {
                        return scope.$eval(attrs.loadingCancel);
                    }, function(value) {
                        if (value) {
                            attrs.$set('disabled', null);
                            element.html(originalHTML);
                        }
                    });
                }
            };
        }]
    };
});