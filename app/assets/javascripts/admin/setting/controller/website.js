/**
 * 修改网站基本设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Website', 'RelativeUrlFactory', 'ErrorMessage', '$timeout', function($scope, Website, RelativeUrlFactory, ErrorMessage, $timeout) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'website';
        $scope.website = Website.get();

        ErrorMessage.extend({
            website: {
                title: {
                    required: '请填写网站名称'
                },
                author: {
                    required: '请填写作者姓名'
                }
            }
        });


        $scope.save = function() {
            $scope.website.$resolved = false;
            if ($scope.form.$valid) {
                $scope.website.$update(function() {
                    $scope.saveSuccess = true;
                    $timeout(function() {
                        $scope.saveSuccess = false;
                    }, 3000);
                });
            }
        };
    }];

    Controller.title = '基本信息';
    Controller.nav = 'setting';

    module.exports = Controller;
});