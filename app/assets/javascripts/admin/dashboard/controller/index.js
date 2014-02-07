/**
 * Dashboard
 */
define(function (require, exports, module) {
    var _ = require('_');
    var Highcharts = require('angular-highcharts').Highcharts;
    var COLORS = Highcharts.getOptions().colors;

    var IndexController = ['$scope', '$http', function ($scope, $http) {
        $http.get('/admin/dashboard').then(function (resp) {
            $scope.dashboard = resp.data;
        });

//        $http.get('/admin/dashboard/total_visits').then(function(resp) {
//            $scope.total_visits = resp.data;
//        });

        $http.get('/admin/dashboard/browser').then(function (resp) {
            var data = _.pluck(resp.data, 'table');

            var browserData = [];
            var versionsData = [];

            var sum = _.reduce(data, function(memo, i){ return memo + parseInt(i.visits) }, 0);

            for (var i = 0; i < data.length; i++) {
                data[i].visits = parseInt(parseInt(data[i].visits)/sum * 100);
                versionsData.push({
                    name: data[i].browser + ' ' + data[i].browserVersion,
                    y: data[i].visits,
                    color: COLORS[i]
                });

                var browser = _.findWhere(browserData, {name: data[i].browser});

                if (browser) {
                    browser.y += data[i].visits;
                } else {
                    browserData.push({
                        name: data[i].browser,
                        y: data[i].visits,
                        color: COLORS[i]
                    });
                }

            }

            $scope.browser = {
                title: {
                    text: '浏览器占有率'
                },
                plotOptions: {
                    pie: {
                        center: ['50%', '50%']
                    }
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
                    //headerFormat: '<span style="font-size: 10px;font-weight:bolder">{point.key:%b%e日 %A}</span><br/>'
                    valueSuffix: '%'
                },
                series: [
                    {
                        name: 'Browsers',
                        data: browserData,
                        size: '60%',
                        dataLabels: {
                            formatter: function () {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: 'white',
                            distance: -30
                        }
                    },
                    {
                        name: 'Versions',
                        data: versionsData,
                        size: '80%',
                        innerSize: '60%',
                        dataLabels: {
                            formatter: function () {
                                // display only if larger than 1
                                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                            }
                        }
                    }
                ]
            };
        });

        $http.get('/admin/dashboard/daily_visits').then(function (resp) {

            $scope.daily_visits = {
                title: {
                    text: '每日访问次数'
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

//        $http.get('/admin/dashboard/top_pages').then(function(resp) {
//            $scope.top_pages = resp.data;
//        });

        $http.get('/admin/dashboard/hot_blogs').then(function (resp) {
            $scope.hotBlogs = resp.data;
        });
    }];

    IndexController.title = 'Dashboard';

    module.exports = IndexController;
});