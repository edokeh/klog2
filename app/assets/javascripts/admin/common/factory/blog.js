/**
 * Blog
 */
define(function (require, exports, module) {
    var _ = require('_');

    module.exports = {
        'Blog': ['$resource', '$http', function ($resource, $http) {
            var Blog = $resource('/admin/blogs/:id.json', {id: '@id'}, {
                create: {method: 'POST'},
                update: {method: 'PUT'},
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: $http.defaults.transformResponse.concat([function (data, header) {
                        if (data.array && angular.isArray(data.array)) {
                            var array = data.array;
                            array.$page = data.page;
                            return array;
                        }
                        else {
                            return data;
                        }
                    }]),
                    interceptor: {
                        response: function (response) {
                            response.resource.$page = response.data.$page;
                            return response.resource;
                        }
                    }
                }
            });

            Blog.prototype.$save = function () {
                if (this.id) {
                    this.$update.apply(this, arguments);
                }
                else {
                    this.$create.apply(this, arguments);
                }
            };

            Blog.STATUS = [
                {value: '1', name: '已发布'},
                {value: '0', name: '草稿箱'},
            ];

            return Blog;
        }]
    };
});