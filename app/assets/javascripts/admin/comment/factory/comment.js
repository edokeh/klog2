/**
 * 评论
 */
define(function(require, exports, module) {
    var _ = require('_');

    module.exports = {
        Comment: ['$resource', '$http', function($resource, $http) {
            var Comment = $resource('/admin/comments/:id.json', {id: '@id'}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: $http.defaults.transformResponse.concat([function(data, header) {
                        if (data.array && _.isArray(data.array)) {
                            var array = data.array;
                            array.$cursor = data.$cursor;
                            return array;
                        }
                        else {
                            return data;
                        }
                    }]),
                    interceptor: {
                        response: function(response) {
                            response.resource.$cursor = response.data.$cursor;
                            return response.resource;
                        }
                    }
                }
            });

            return Comment;
        }]
    };
});