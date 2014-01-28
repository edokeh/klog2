/**
 * Dashboard
 */
define(function(require, exports, module) {

    var IndexController = ['$scope', '$http', function($scope, $http) {
        $http.get('/admin/dashboard').then(function(resp) {
            $scope.dashboard = resp.data;
        });

        $http.get('/admin/dashboard/hot_blogs').then(function(resp) {
            $scope.hotBlogs = resp.data;
        });
    }];

    IndexController.title = 'Dashboard';

    module.exports = IndexController;
});