/**
 * 辅助表单校验的报错信息显示
 */
define(function (require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = angular.module('errorMsg', [])
        .factory('ErrorMsg', function () {
            var msg = {};
            return {
                set: function (arg) {
                    msg = arg;
                },
                get: function (key) {
                    return msg[key] || {};
                },
                // 扩充已有的 error msg，增加服务器返回的报错信息
                // 将 {key : [msg], ... } 传入即可
                extendFromServer: function (errors) {
                    _.each(errors, function (msgs, key) {
                        msg[key] = msg[key] || {};
                        msg[key].server = msgs[0];
                    });
                }
            };
        })
        .filter('errorMsg', ['ErrorMsg', function (ErrorMsg) {
            return function (field) {
                var errorMsg = ErrorMsg.get(field.$name);
                var error;
                _.any(field.$error, function (v, k) {
                    if (v) {
                        error = errorMsg[k];
                        return true;
                    }
                });
                return error;
            };
        }])
        .directive('errorMsg',function () {
            return {
                restrict: 'CA',
                scope: {
                    field: '=errorMsg'
                },
                template: require('./template/error-msg.html')
            };
        }).directive('formValid', ['ErrorMsg',function (ErrorMsg) {
            return {
                restrict: 'AC',
                require: 'form',
                link: function (scope, element, attrs, form) {
                    attrs.$set('novalidate', 'novalidate');

                    var formName = attrs.formValid || attrs.name;

                    element.on('submit', function () {
                        _.each(form, function (control, name) {
                            if (name[0] !== '$') {
                                control.$submitted = true;
                            }
                        });
                        scope.$apply();
                    });

                    form.$setValidity = _.wrap(form.$setValidity, function (fn, validationToken, isValid, control) {
                        fn.call(form, validationToken, isValid, control);

                        if (!isValid) {
                            control.$errorMessage = ErrorMsg[formName][control.$name][validationToken];
                        } else {
                            control.$errorMessage = null;
                        }
                    });
                }
            };
        }]);
});