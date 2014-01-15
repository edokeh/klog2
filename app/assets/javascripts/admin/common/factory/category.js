/**
 * 分类
 */
define(function(require, exports, module) {

    module.exports = {
        'Category': ['$resource', function($resource) {
            var Category = $resource('/admin/categories/:id', {id: '@id'}, {
                update: {
                    method: 'PUT'
                }
            });

            return Category;
        }]
    };
});