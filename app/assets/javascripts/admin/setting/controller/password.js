/**
 * 密码设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Password', 'RelativeUrlFactory', 'ErrorMsg', function($scope, Password, RelativeUrlFactory, ErrorMsg) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'password';
        $scope.password = new Password();
        ErrorMsg.set({
            old_pw: {
                required: '旧密码不能为空',
                validate: '旧密码错误'
            },
            new_pw: {
                required: '新密码至少需要6位',
                minlength: '新密码至少需要6位'
            },
            new_pw_confirmation: {
                equalTo: '新密码两次输入不一致'
            }
        });

        $scope.save = function() {
            if ($scope.form.$valid) {
                $scope.password.$save(function() {

                }, function(resp) {
                    ErrorMsg.extendFromServer(resp.data.errors);
                    $scope.form.old_pw.$setValidity('server', false);
                });
            }
            else {
                //$scope.password.$save();
            }
        };
    }];

    Controller.title = '密码设置';
    Controller.nav = 'setting';

    module.exports = Controller;
});