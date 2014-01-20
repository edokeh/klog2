/**
 * 页面
 */
define(function(require, exports, module) {
    var _ = require('_');

    module.exports = {
        'Page': ['$resource', '$http', 'Attach', function($resource, $http, Attach) {
            var Page = $resource('/admin/pages/:id', {id: '@id'}, {
                create: {method: 'POST'},
                update: {method: 'PUT'},
                get: {
                    method: 'GET',
                    interceptor: {
                        response: function(response) {
                            if (response.resource.attaches) {
                                response.resource.attaches = _.map(response.resource.attaches, function(a) {
                                    return new Attach(a);
                                });
                            }
                        }
                    }
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