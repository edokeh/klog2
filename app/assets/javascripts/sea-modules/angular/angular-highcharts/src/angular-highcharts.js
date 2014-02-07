/**
 * 对 Highcharts 的封装
 * <div highcharts options="dailyVisits" type="spline" height="250"></div>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var Highcharts = require('./highcharts');

    module.exports = angular.module('angular-highcharts', []).directive('highChart', function() {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                options: "="
            },
            transclude: true,
            replace: true,

            link: function(scope, element, attrs) {
                var chartsDefaults = {
                    chart: {
                        renderTo: element[0],
                        type: attrs.type || null,
                        height: attrs.height || null,
                        width: attrs.width || null
                    }
                };

                //Update when charts data changes
                scope.$watch('options', function(value) {
                    if (!value) {
                        return;
                    }
                    var deepCopy = true;
                    var newSettings = {};
                    angular.extend(newSettings, chartsDefaults, value);
                    var chart = new Highcharts.Chart(newSettings);
                });
            }
        };
    });

    module.exports.Highcharts = Highcharts;
});