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
                            array.totalPages = data.total_pages;
                            array.currentPage = data.current_page;
                            array.isLast = data.is_last;
                            return array;
                        }
                        else {
                            return data;
                        }
                    }]),
                    interceptor: {
                        response: function (response) {
                            response.resource.totalPages = response.data.totalPages;
                            response.resource.currentPage = response.data.currentPage;
                            response.resource.isLast = response.data.isLast;
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