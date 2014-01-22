/**
 * 校验表单的模块
 *
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    var validation = angular.module('validation', []);

    /**
     * 给表单元素添加 validation
     *   1. 当元素校验时，会给 ngModelController 添加 $errorMessage 属性，信息源自 ErrorMessage 与 validation 的 key
     *   2. 表单提交时，给所有 ngModelController 添加 $submitted 属性
     *   3. 自动加上 novalidate
     *   4. 表单 Controller 有 $errorMessages 属性，在提交时可以获取
     *   <form validation="blog" />
     */
    validation.directive('validation', ['ErrorMessage', function(ErrorMessage) {
        return {
            restrict: 'AC',
            require: 'form',
            link: function(scope, element, attrs, form) {
                attrs.$set('novalidate', 'novalidate');
                var errorMessage = ErrorMessage.get(attrs.validation || attrs.name);
                form.$errorMessages = {};

                // model.$submitted && form.$errorMessages
                element.on('submit', function() {
                    element.addClass('ng-submitted');
                    _.each(form, function(control, name) {
                        if (name[0] !== '$') {
                            control.$submitted = true;
                        }
                    });
                    scope.$apply();
                });

                form.$setValidity = _.wrap(form.$setValidity, function(fn, validationToken, isValid, control) {
                    fn.call(form, validationToken, isValid, control);

                    if (control.$valid) {
                        control.$errorMessage = null;
                    }
                    else {
                        var errorMsg = (errorMessage[control.$name] || {})[validationToken];
                        if (isValid) {
                            if (control.$errorMessage === errorMsg) {
                                control.$errorMessage = null;
                            }
                        }
                        else {
                            // 只显示第一条校验规则的报错
                            if (!control.$errorMessage) {
                                control.$errorMessage = (errorMessage[control.$name] || {})[validationToken];
                            }
                        }
                    }
                    // 更新 form.$errorMessages
                    if (control.$errorMessage) {
                        form.$errorMessages[control.$name] = control.$errorMessage;
                    }
                    else {
                        delete form.$errorMessages[control.$name];
                    }
                });

                form.$setPristine = _.wrap(form.$setPristine, function(fn) {
                    fn.call(form);
                    element.removeClass('ng-submitted');
                    _.each(form, function(control, name) {
                        if (name[0] !== '$') {
                            control.$submitted = false;
                        }
                    });
                });
            }
        };
    }]);

    /**
     * 提供报错信息的类，以 Hash 形式存储
     */
    validation.factory('ErrorMessage', function() {
        var msg = {};
        return {
            set: function(arg) {
                msg = arg;
            },
            get: function(key) {
                if (!msg[key]) {
                    msg[key] = {};
                }
                return msg[key];
            },
            extend: function(hash) {
                angular.extend(msg, hash);
            }
        };
    });

    /**
     * 简单的显示报错信息的元素
     */
    validation.directive('errorFor', function() {
        return {
            restrict: 'CA',
            scope: {
                field: '=errorFor'
            },
            template: require('./template/error-for.html')
        };
    });

    /**
     * 用于显示服务器的校验报错信息，需要将服务器的报错手动赋值
     * <input type="text" server-valid="serverError" />
     */
    validation.directive('serverValid', function() {
        return {
            restrict: 'CA',
            require: ['ngModel', '?^form'],
            link: function(scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                var form = ctrls[1];

                scope.$watch(function() {
                    return scope.$eval(attrs.serverValid);
                }, function(value) {
                    if (value && value[ngModel.$name]) {
                        ngModel.$setValidity('server', false);
                        ngModel.$errorMessage = value[ngModel.$name][0];
                        if (form && form.$errorMessages) {
                            form.$errorMessages[ngModel.$name] = ngModel.$errorMessage;
                        }
                    }
                    else {
                        ngModel.$setValidity('server', true);
                    }
                });

                element.on('keyup', function() {
                    ngModel.$setValidity('server', true);
                    scope.$apply();
                });
            }
        };
    });

    module.exports = validation;
})
;