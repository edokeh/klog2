/**
 * Dashboard
 */
define(function(require, exports, module) {
    var _ = require('_');
    var Highcharts = require('angular-highcharts').Highcharts;
    var COLORS = Highcharts.getOptions().colors;

    var IndexController = ['$scope', '$http', '$modal', function($scope, $http, $modal) {
        $http.get('/admin/dashboard').then(function(resp) {
            $scope.dashboard = resp.data;

            // 如果启用了 ga chart
            if ($scope.dashboard.ga_enable) {
                $scope.getTopPage();
                $scope.getDailyVisit();
                $scope.getBrowser();
            }
            else {
                $scope.nowDate = Highcharts.dateFormat('%m月%d日', new Date().getTime());
            }
        });

        // 获取评论最多的 blog
        $http.get('/admin/dashboard/hot_blogs').then(function(resp) {
            $scope.hotBlogs = resp.data;
        });

        // 获取浏览器份额
        $scope.getBrowser = function() {
            $http.get('/admin/dashboard/browser').then(function(resp) {
                var data = resp.data;
                // 将数据处理为两层
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
                    title: chartTitle('浏览器占有率'),
                    plotOptions: {
                        pie: {
                            center: ['50%', '50%']
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
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
        };

        // 获取每日的访问量
        $scope.getDailyVisit = function() {
            $http.get('/admin/dashboard/daily_visits').then(function(resp) {

                $scope.daily_visits = {
                    title: chartTitle('每日访问次数'),
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
        };

        // 获取访问最多的页面
        $scope.getTopPage = function() {
            $http.get('/admin/dashboard/top_pages').then(function(resp) {
                $scope.topPages = resp.data;
            });
        };

        // 同步日志
        $scope.showSynLogs = function() {
            var modal = $modal.open({
                template: require('../template/logs.html'),
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                    $scope.getLogs = function() {
                        $http.get('/admin/dashboard/sync_comment_logs').then(function(resp) {
                            $scope.logs = resp.data;
                        });
                    };

                    $scope.sync = function() {
                        $scope.sync_loading = true;
                        $http.post('/admin/dashboard/sync_comment').then(function() {
                            $scope.getLogs();
                            $scope.sync_loading = false;
                        });
                    };

                    $scope.getLogs();
                    $scope.modal = $modalInstance;
                }]
            });
            return modal.result;
        };

        // 保留一位小数的百分率
        function toPercent(v, total) {
            return parseFloat((v / total * 100).toFixed(1));
        }

        // Chart 标题生成
        function chartTitle(title) {
            return {
                text: title,
                margin: 25,
                style: {
                    'font-weight': 'bolder',
                    'font-family': '微软雅黑',
                    'font-size': '20px'
                }
            };
        }
    }];

    IndexController.title = 'Dashboard';

    module.exports = IndexController;
});