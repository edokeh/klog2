/**
 * Disqus 设置
 */
define(function(require, exports, module) {

    module.exports = {
        'Disqus': ['$resource', function($resource) {
            var Disqus = $resource('/admin/disqus.json', null, {
                update: {
                    method: 'PUT'
                }
            });

            return Disqus;
        }]
    };
});