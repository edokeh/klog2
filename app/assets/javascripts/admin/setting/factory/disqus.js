/**
 * Disqus 设置
 */
define(function (require, exports, module) {

    module.exports = {
        'Disqus': ['$resource', function ($resource) {
            var URL = '/admin/disqus';
            var ENABLE_URL = '/admin/disqus/enable';

            var Disqus = $resource(URL, null, {
                update: {
                    method: 'PUT'
                },

                updateEnable: {
                    method: 'PUT',
                    url: ENABLE_URL
                }
            });

            return Disqus;
        }]
    };
});