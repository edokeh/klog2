/**
 * 辅助表单校验的报错信息显示
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = angular.module('errorMsg', [])
        .factory('ErrorMsg', function() {
            var msg = {};
            return {
                set: function(arg) {
                    msg = arg;
                },
                get: function(key) {
                    return msg[key];
                }
            };
        })
        .filter('errorMsg', ['ErrorMsg', function(ErrorMsg) {
            return function(field) {
                var errorMsg = ErrorMsg.get(field.$name);
                var error;
                _.any(field.$error, function(v, k) {
                    if (v) {
                        error = errorMsg[k];
                        return true;
                    }
                });
                return error;
            };
        }]);
});