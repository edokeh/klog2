/**
 * Blog
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    module.exports = {
        'Attach': ['$resource', '$http', '$q', '$rootScope', function($resource, $http, $q, $rootScope) {
            var Attach = $resource('/admin/attaches/:id', {id: '@id'}, {
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
                }
            });

            // 创建，因为要获取上传进度，只能自己重写
            Attach.create = function(data, success, error) {
                var value = new Attach(data);

                var httpConfig = {
                    headers: {
                        'Content-Type': undefined
                    },
                    url: '/admin/attaches.json',
                    method: 'POST',
                    data: data,
                    transformRequest: function(data) {
                        var formData = new FormData();
                        formData.append('file', data.originalFile, data.originalFile.name);
                        if (data.max_width) {
                            formData.append('max_width', data.max_width);
                        }
                        formData.setXHR = function(xhr) {
                            xhr.upload.onprogress = function(e) {
                                value.originalFile.percent = 100.0 * e.loaded / e.total;
                                $rootScope.$apply();
                            };
                        };
                        return formData;
                    }
                };

                var promise = $http(httpConfig).then(function(response) {
                    var data = response.data;
                    var promise = value.$promise;

                    if (data) {
                        angular.copy(data, value);
                        value.$promise = promise;
                    }

                    value.$resolved = true;
                    response.resource = value;
                    return response;
                }, function(response) {
                    value.$resolved = true;
                    (error || angular.noop)(response);
                    return $q.reject(response);
                });

                promise = promise.then(function(response) {
                    (success || angular.noop)(response.resource, response.headers);
                    return response.resource;
                });

                value.$promise = promise;
                value.$resolved = false;

                return value;
            };

            return Attach;
        }]
    };
});