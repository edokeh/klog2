/**
 * 页面
 */
define(function(require, exports, module) {
    var _ = require('_');

    module.exports = {
        'Page': ['$resource', '$http', 'Attach', '$sce', function($resource, $http, Attach, $sce) {

            var responseInterceptor = {
                response: function(response) {
                    if (response.resource.attaches) {
                        response.resource.attaches = _.map(response.resource.attaches, function(a) {
                            return new Attach(a);
                        });
                    }
                    response.resource.html_content = $sce.trustAsHtml(response.resource.html_content);
                }
            };

            var Page = $resource('/admin/pages/:id', {id: '@id'}, {
                create: {
                    method: 'POST',
                    interceptor: responseInterceptor
                },
                update: {
                    method: 'PUT',
                    interceptor: responseInterceptor
                },
                get: {
                    method: 'GET',
                    interceptor: responseInterceptor
                },
                up: {
                    method: 'POST',
                    url: '/admin/pages/:id/up'
                },
                down: {
                    method: 'POST',
                    url: '/admin/pages/:id/down'
                }
            });

            Page.prototype.$save = function() {
                if (this.id) {
                    this.$update.apply(this, arguments);
                }
                else {
                    this.$create.apply(this, arguments);
                }
            };

            return Page;
        }]
    };
});