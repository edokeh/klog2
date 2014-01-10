/**
 * 修改网站基本设置
 */
define(function (require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Website', 'RelativeUrlFactory', '$routeParams', '$location', function ($scope, Website, RelativeUrlFactory, $routeParams, $location) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.website = Website.get();
        $scope.navClass = 'website';

        $scope.save = function () {
            $scope.website.$update();
        };
    }];

    Controller.title = '基本信息';

    module.exports = Controller;
});