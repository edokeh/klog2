/**
 * GA 设置
 */
define(function (require, exports, module) {

    module.exports = {
        'GA': ['$resource', function ($resource) {
            var URL = '/admin/ga';

            var GA = $resource(URL, null, {
                update: {
                    method: 'PUT'
                }
            });

            return GA;
        }]
    };
});