/**
 * 分类设置
 */
define(function(require, exports, module) {
    var _ = require('_');
    var angular = require('angularjs');

    var Controller = ['$scope', 'Category', 'RelativeUrlFactory', 'Confirm', 'ErrorMessage', function($scope, Category, RelativeUrlFactory, Confirm, ErrorMessage) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'category';
        $scope.categories = Category.query();
        $scope.newCategory = new Category();

        ErrorMessage.extend({
            category: {
                name: {
                    required: '请填写分类名称',
                    minlength: '分类名称至少需要2个字符'
                }
            }
        });

        $scope.add = function() {
            $scope.newCategory.$resolved = false;

            if ($scope.addForm.$valid) {
                $scope.newCategory.$save(function(data) {
                    $scope.categories.push(data);
                    $scope.newCategory = new Category();
                    $scope.newCategory.$resolved = true;
                    $scope.addForm.$setPristine();
                }, function(resp) {
                    $scope.addServerError = resp.data.errors;
                });
            }
        };

        // 修改
        $scope.edit = function(category) {
            $scope.cancelEdit($scope.editingCategory);
            $scope.editingCategory = category;
            $scope.originalCategory = angular.copy(category); // backup
        };

        $scope.cancelEdit = function(category) {
            angular.copy($scope.originalCategory, category);
            $scope.editingCategory = null;
        };

        $scope.clearEditError = function() {
            $scope.editServerError = null;
        };

        // ngif 创建了新的 scope,所以这里需要用参数传递 FormController
        $scope.update = function(category, form) {
            if (form.$valid) {
                category.$update(function() {
                    $scope.editingCategory = null;
                }, function(resp) {
                    $scope.editServerError = resp.data.errors;
                });
            }
        };

        // 删除
        $scope.remove = function(category) {
            Confirm.open('确定要删除“' + category.name + '”？').then(function() {
                category.$remove(function() {
                    $scope.categories = _.without($scope.categories, category);
                });
            });
        };
    }];

    Controller.title = '分类设置';
    Controller.nav = 'setting';

    module.exports = Controller;
});