/**
 * 分类设置
 */
define(function(require, exports, module) {
    var _ = require('_');
    var angular = require('angularjs');

    var Controller = ['$scope', 'Category', 'RelativeUrlFactory', 'Confirm', 'ErrorMsg', function($scope, Category, RelativeUrlFactory, Confirm, ErrorMsg) {
        $scope.relativeUrl = RelativeUrlFactory.create(module);
        $scope.navClass = 'category';
        $scope.categories = Category.query();
        $scope.newCategory = new Category();

        ErrorMsg.set({
            name: {
                required: '分类名称至少需要2个字符',
                minlength: '分类名称至少需要2个字符',
                unique: '分类名称已经存在'
            }
        });

        $scope.add = function() {
            if ($scope.addForm.$valid) {
                $scope.newCategory.$save(function(data) {
                    $scope.categories.push(data);
                    $scope.newCategory = new Category();
                    $scope.addForm.name.$setPristine();
                }, function(resp) {
                    $scope.addForm.name.$setValidity('unique', false);
                });
            }
            else {
                $scope.addForm.name.$setViewValue($scope.addForm.name.$viewValue);
            }
        };

        $scope.clearValid = function(field) {
            field.$setValidity('unique', true);
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

        // ngif 创建了新的 scope,所以这里需要用参数传递 FormController
        $scope.update = function(category, form) {
            if (form.$valid) {
                category.$update(function() {
                    $scope.editingCategory = null;
                }, function() {
                    form.name.$setValidity('unique', false);
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