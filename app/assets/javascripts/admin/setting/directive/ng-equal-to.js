/**
 * 校验表单域的值是否等于某个值
 */
define(function (require, exports, module) {
    module.exports = {
        'ngEqualTo': [function () {
            return {
                restrict: 'AC',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    scope.$watch(function () {
                        return scope.$eval(attrs.ngEqualTo);
                    }, function (value) {
                        ngModel.$setValidity('equalTo', ngModel.$modelValue === value);
                    });

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (value) {
                        ngModel.$setValidity('equalTo', scope.$eval(attrs.ngEqualTo) === value);
                    });
                }
            };
        }]
    };
});