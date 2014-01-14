/**
 * Disqus 设置
 */
define(function(require, exports, module) {

    module.exports = {
        'Password': ['$resource', function($resource) {

            var Password = $resource('/admin/password', null, {
                save: {
                    method: 'PUT'
                }
            });

            return Password;
        }]
    };
});