/**
 * ajax 指示器
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    var ajaxSpinner = angular.module('ajax-spinner', []);

    ajaxSpinner.config(['$httpProvider', function($httpProvider) {

        $httpProvider.interceptors.push(['$rootScope', '$q', '$timeout', function($rootScope, $q, $timeout) {
            var lastTimeout;
            var requestQueue = [];
            var SHOW_AFTER = 200;

            return {
                'request': function(config) {
                    config.reqTimeout = $timeout(function() {
                        $rootScope.ajaxing = true;
                        $rootScope.ajaxingMethod = config.method;
                    }, SHOW_AFTER);
                    config.requestStartAt = new Date().getTime();
                    requestQueue.push(config);

                    return config || $q.when(config);
                },
                'response': function(response) {
                    var config = response.config;
                    requestQueue = _.without(requestQueue, config);
                    $timeout.cancel(config.reqTimeout);
                    $timeout(function() {
                        if (requestQueue.length === 0) {
                            $rootScope.ajaxing = false;
                        }
                    }, config.requestStartAt + SHOW_AFTER + 700 - new Date().getTime());

                    return response || $q.when(response);
                }
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
