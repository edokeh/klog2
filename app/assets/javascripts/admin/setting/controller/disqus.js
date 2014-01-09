/**
 * 修改 Disqus 设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Disqus', 'RelativeUrl', '$routeParams', '$location', function($scope, Disqus, RelativeUrl, $routeParams, $location) {
        $scope.relativeUrl = RelativeUrl(module);
        $scope.disqus = Disqus.get();
        $scope.navClass = 'disqus';

        $scope.save = function() {
            $scope.disqus.$update();
        }
    }];

    Controller.title = 'Disqus 设置';

    module.exports = Controller;
});