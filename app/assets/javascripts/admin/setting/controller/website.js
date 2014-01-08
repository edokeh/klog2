/**
 * 编辑或新建 blog
 */
define(function (require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Website', '$routeParams', '$location', function ($scope, Website, $routeParams, $location) {
        $scope.website = Website.get();

        $scope.save = function () {
            $scope.website.$update();
        }
    }];

    Controller.title = '网站设置';

    module.exports = Controller;
});