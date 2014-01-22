/**
 * Blog
 */
define(function(require, exports, module) {
    var _ = require('_');

    module.exports = {
        'Blog': ['$resource', '$http', 'Attach', function($resource, $http, Attach) {
            var Blog = $resource('/admin/blogs/:id', {id: '@id'}, {
                create: {method: 'POST'},
                update: {method: 'PUT'},
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: $http.defaults.transformResponse.concat([function(data, header) {
                        if (data.array && _.isArray(data.array)) {
                            var array = data.array;
                            array.$page = data.page;
                            return array;
                        }
                        else {
                            return data;
                        }
                    }]),
                    interceptor: {
                        response: function(response) {
                            response.resource.$page = response.data.$page;
                            return response.resource;
                        }
                    }
                },
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
                },
                publish: {
                    method: 'POST',
                    url: '/admin/blogs/:id/publish'
                }
            });

            Blog.prototype.$save = function() {
                if (this.id) {
                    this.$update.apply(this, arguments);
                }
                else {
                    this.$create.apply(this, arguments);
                }
            };

            Blog.STATUS = [
                {value: '1', name: '已发布'},
                {value: '0', name: '草稿'},
            ];

            Blog.DEFAULT_STATUS = '1';

            Blog.getStatusText = function(value) {
                value = value || Blog.DEFAULT_STATUS;
                return _.findWhere(Blog.STATUS, {value: value});
            };

            return Blog;
        }]
    };
});