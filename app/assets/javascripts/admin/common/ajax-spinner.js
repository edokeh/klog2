/**
 * ajax 指示器
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    var ajaxSpinner = angular.module('ajax-spinner', []);

    ajaxSpinner.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$rootScope', '$q', '$timeout', function($rootScope, $q, $timeout) {
            var requestQueue = [];
            var SHOW_AFTER = 200;

            // spinner 会在请求一段时间后才显示
            function requestHandler(config) {
                config.reqTimeout = $timeout(function() {
                    $rootScope.ajaxing = true;
                    $rootScope.ajaxingMethod = config.method;
                }, SHOW_AFTER);
                config.requestStartAt = new Date().getTime();
                requestQueue.push(config);

                return config || $q.when(config);
            }

            // 响应到达时隐藏
            // 速度快的请求不显示 spinner
            // 所有响应到达时才隐藏，避免上下反复
            function responseHandler(response) {
                // config 来自 request 的设置
                var config = response.config;
                requestQueue = _.without(requestQueue, config);
                $timeout.cancel(config.reqTimeout);
                $timeout(function() {
                    if (requestQueue.length === 0) {
                        $rootScope.ajaxing = false;
                    }
                }, config.requestStartAt + SHOW_AFTER + 500 + 200 - new Date().getTime());

                if (response.status >= 400) {
                    return $q.reject(response);
                }
                else {
                    return response || $q.when(response);
                }
            }

            return {
                'request': requestHandler,
                'response': responseHandler,
                'responseError': responseHandler
            };
        }]);
    }]);

    ajaxSpinner.directive('ajaxSpinner', function() {
        return {
            restrict: 'EA',
            template: require('./template/ajax-spinner.html')
        };
    });

    module.exports = ajaxSpinner;
});