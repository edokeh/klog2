/**
 * 给现有的 Attach 增加方法
 */
define(function(require, exports, module) {

    module.exports = ['Attach', '$rootScope', '$q', '$resource', '$http', function(Attach, $rootScope, $q, $resource, $http) {

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
    }];
});