/**
 * 密码设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Password', 'RelativeUrlFactory', 'ErrorMessage', function($scope, Password, RelativeUrlFactory, ErrorMessage) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'password';
        $scope.password = new Password();

        ErrorMessage.extend({
            password: {
                old_pw: {
                    required: '旧密码不能为空'
                },
                new_pw: {
                    required: '新密码不能为空',
                    minlength: '新密码至少需要6位'
                },
                new_pw_confirmation: {
                    equalTo: '新密码两次输入不一致'
                }
            }
        });

        $scope.save = function() {
            $scope.saveSuccess = false;
            $scope.serverError = null;

            if ($scope.form.$valid) {
                $scope.password.$save(function() {
                    $scope.password = new Password();
                    $scope.form.$setPristine();
                    $scope.saveSuccess = true;
                }, function(resp) {
                    $scope.serverError = resp.data.errors;
                });
            }
        };
    }];

    Controller.title = '密码设置';
    Controller.nav = 'setting';

    module.exports = Controller;
});