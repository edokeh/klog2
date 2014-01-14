/**
 * 修改 Disqus 设置
 */
define(function (require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Password', 'RelativeUrlFactory', function ($scope, Password, RelativeUrlFactory) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'password';
        $scope.password = new Password();

        $scope.save = function () {
            $scope.password.$save();
        };
    }];

    Controller.title = '密码设置';

    module.exports = Controller;
});