/**
 * 修改网站基本设置
 */
define(function (require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Website', 'RelativeUrl', '$routeParams', '$location', function ($scope, Website, RelativeUrl, $routeParams, $location) {
        $scope.relativeUrl = RelativeUrl(module);
        $scope.website = Website.get();
        $scope.navClass = 'website';

        $scope.save = function () {
            $scope.website.$update();
        }
    }];

    Controller.title = '基本信息';

    module.exports = Controller;
});