/**
 * 管理附件
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Attach', '$http', 'RelativeUrlFactory', 'Confirm', '$location', '$routeParams', '$route', function($scope, Attach, $http, RelativeUrlFactory, Confirm, $location, $routeParams, $route) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'attach';
        var currPage;

        // 获取统计
        $scope.getStat = function() {
            $http.get('/admin/dashboard/attach').then(function(resp) {
                $scope.attachStat = resp.data;
            });
        };

        $scope.jumpPage = function(page) {
            $location.search('page', page);
            currPage = page;

            Attach.query({page: page}, function(data) {
                $scope.attaches = data;
            });
        };

        $scope.remove = function(attach) {
            Confirm.open('确定要删除“' + attach.file_name + '”？').then(function() {
                attach.$remove(function() {
                    $scope.jumpPage(currPage);
                    $scope.getStat();
                });
            });
        };

        $scope.$on('$routeUpdate', function() {
            if ($routeParams.page !== currPage) {
                $scope.jumpPage($routeParams.page);
            }
        });

        // 初始化
        $scope.jumpPage($routeParams.page || 1);
        $scope.getStat();
    }];

    Controller.title = '附件管理';
    Controller.nav = 'setting';

    module.exports = Controller;
});