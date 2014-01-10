/**
 * 修改 Disqus 设置
 */
define(function (require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Disqus', 'RelativeUrlFactory', '$routeParams', '$location', function ($scope, Disqus, RelativeUrlFactory, $routeParams, $location) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.disqus = Disqus.get();
        $scope.navClass = 'disqus';

        $scope.enableDisqus = function (bool) {
            $scope.disqus.enable = bool;
            $scope.disqus.$updateEnable();
        };

        $scope.save = function () {
            $scope.disqus.$update();
        };
    }];

    Controller.title = 'Disqus 设置';

    module.exports = Controller;
});