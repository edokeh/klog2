/**
 * Blog
 */
define(function(require, exports, module) {
    module.exports = {
        'Attach': ['$resource', function($resource) {
            var Attach = $resource('/admin/attaches/:id.json', {id: '@id'}, {});

            return Attach;
        }]
    };
});