/**
 * 管理附件
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Attach', 'RelativeUrlFactory', 'Confirm', '$location', '$routeParams', '$route', function($scope, Attach, RelativeUrlFactory, Confirm, $location, $routeParams, $route) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'attach';
        var currPage;

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
                });
            });
        };

        $scope.jumpPage($routeParams.page || 1);

        $scope.$on('$routeUpdate', function() {
            if ($routeParams.page !== currPage) {
                $scope.jumpPage($routeParams.page);
            }
        });
    }];

    Controller.title = '附件管理';
    Controller.nav = 'setting';

    module.exports = Controller;
});