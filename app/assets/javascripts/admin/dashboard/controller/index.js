/**
 * Dashboard
 */
define(function(require, exports, module) {
    var _ = require('_');
    var Highcharts = require('angular-highcharts').Highcharts;
    var COLORS = Highcharts.getOptions().colors;

    var IndexController = ['$scope', '$http', function($scope, $http) {
        $http.get('/admin/dashboard').then(function(resp) {
            $scope.dashboard = resp.data;
        });

        $http.get('/admin/dashboard/top_pages').then(function(resp) {
            $scope.topPages = resp.data;
        });

        $http.get('/admin/dashboard/hot_blogs').then(function(resp) {
            $scope.hotBlogs = resp.data;
        });

        $http.get('/admin/dashboard/browser').then(function(resp) {
            var data = resp.data;

            var totalVisits = _.reduce(data, function(memo, i) {
                return memo + i.visits;
            }, 0);

            var browserData = [];
            var versionsData = [];

            var groupData = _.groupBy(data, 'browser');
            _.each(groupData, function(versions, browser) {
                var versionTotalVisits = _.reduce(versions, function(memo, i) {
                    return memo + i.visits;
                }, 0);
                var color = COLORS[browserData.length];
                browserData.push({
                    name: browser,
                    y: toPercent(versionTotalVisits, totalVisits),
                    color: color
                });

                versionsData = versionsData.concat(versions.map(function(v, index) {
                    var brightness = 0.2 - (index / versions.length) / 5;
                    return {
                        name: v.browser + ' ' + v.browserVersion,
                        y: toPercent(v.visits, totalVisits),
                        color: Highcharts.Color(color).brighten(brightness).get()
                    };
                }));
            });

            $scope.browser = {
                title: {
                    text: '浏览器占有率',
                    margin: 25,
                    style: chartTitleStyle()
                },
                plotOptions: {
                    pie: {
                        center: ['50%', '50%']
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    //headerFormat: '<span style="font-size: 10px;font-weight:bolder">{point.key:%b%e日 %A}</span><br/>'
                    valueSuffix: '%'
                },
                series: [
                    {
                        name: 'Browsers',
                        data: browserData,
                        size: '60%',
                        dataLabels: {
                            formatter: function() {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: 'white',
                            distance: -40
                        }
                    },
                    {
                        name: 'Versions',
                        data: versionsData,
                        size: '80%',
                        innerSize: '60%',
                        dataLabels: {
                            formatter: function() {
                                // display only if larger than 1
                                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                            }
                        }
                    }
                ]
            };
        });

        $http.get('/admin/dashboard/daily_visits').then(function(resp) {

            $scope.daily_visits = {
                title: {
                    text: '每日访问次数',
                    margin: 25,
                    style: chartTitleStyle()
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value:%b%e日}'
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 10px;font-weight:bolder">{point.key:%b%e日 %A}</span><br/>'
                },
                series: [
                    {
                        name: "访问次数",
                        data: resp.data
                    }
                ]
            };
        });

        function toPercent(v, total) {
            return parseFloat((v / total * 100).toFixed(1));
        }

        function chartTitleStyle() {
            return {
                'font-weight': 'bolder',
                'font-family': '微软雅黑',
                'font-size': '20px'
            };
        }
    }];

    IndexController.title = 'Dashboard';

    module.exports = IndexController;
});