/**
 * 修改 Disqus 设置
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var Controller = ['$scope', 'GA', 'Attach', 'RelativeUrlFactory', 'ErrorMessage', '$timeout', function($scope, GA, Attach, RelativeUrlFactory, ErrorMessage, $timeout) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'ga';
        $scope.ga = GA.get();

        ErrorMessage.extend({
            ga: {
                api_email: {
                    required: '请填写 Shortname'
                }
            }
        });

        $scope.upload = function(files) {
            $scope.ga.secret_file = Attach.create({
                originalFile: files[0]
            });
        };

        $scope.save = function() {
            $scope.ga.$resolved = false;
            if ($scope.form.$valid) {
                $scope.ga.$update(function() {
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

    Controller.title = 'GA 设置';
    Controller.nav = 'setting';

    module.exports = Controller;
});