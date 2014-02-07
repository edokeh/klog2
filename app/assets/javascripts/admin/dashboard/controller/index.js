/**
 * Dashboard
 */
define(function(require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', '$http', function($scope, $http) {
        $http.get('/admin/dashboard').then(function(resp) {
            $scope.dashboard = resp.data;
        });

        $http.get('/admin/dashboard/total_visits').then(function(resp) {
            $scope.total_visits = resp.data;
        });

        $http.get('/admin/dashboard/daily_visits').then(function(resp) {

            $scope.daily_visits = {
                title: {
                    text: '每日访问量'
                },
                xAxis: {
                    type: 'datetime'
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
                series: [
                    {
                        name: "访问量",
                        data: _.pluck(resp.data, 'visits'),
                        pointStart: Date.UTC(2010, 0, 1),
                        pointInterval: 24 * 3600 * 1000 // one day
                    }
                ]
            };
        });

        $http.get('/admin/dashboard/top_pages').then(function(resp) {
            $scope.top_pages = resp.data;
        });

        $http.get('/admin/dashboard/hot_blogs').then(function(resp) {
            $scope.hotBlogs = resp.data;
        });
    }];

    IndexController.title = 'Dashboard';

    module.exports = IndexController;
});