/**
 * 修改 Disqus 设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'Disqus', 'RelativeUrlFactory', 'ErrorMessage', '$timeout', function($scope, Disqus, RelativeUrlFactory, ErrorMessage, $timeout) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'disqus';
        $scope.disqus = Disqus.get();

        ErrorMessage.extend({
            disqus: {
                shortname: {
                    required: '请填写 Shortname'
                },
                api_secret: {
                    required: '请填写 API Secret'
                },
                access_token: {
                    required: '请填写 Access Token'
                }
            }
        });

        $scope.enableDisqus = function(bool) {
            $scope.disqus.enable = bool;
            $scope.disqus.$updateEnable();
        };

        $scope.save = function() {
            $scope.disqus.$resolved = false;
            if ($scope.form.$valid) {
                $scope.disqus.$update(function() {
                    $scope.saveSuccess = true;
                    $timeout(function() {
                        $scope.saveSuccess = false;
                    }, 3000);
                }, function(resp) {
                    $scope.serverError = resp.data.errors;
                });
            }
        };
    }];

    Controller.title = 'Disqus 设置';
    Controller.nav = 'setting';

    module.exports = Controller;
});