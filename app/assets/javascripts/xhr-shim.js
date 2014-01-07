/**
 * 由于 angular 不支持从 $http 中获取 xhr 对象，导致上传进度事件无法绑定，只能在这里做一个楔子
 */
if (window.XMLHttpRequest && window.FormData) {

    window.XMLHttpRequest = (function(origXHR) {
        return function() {
            var xhr = new origXHR();
            xhr.send = (function(orig) {
                return function() {
                    if (arguments[0] instanceof FormData && arguments[0].setXHR) {
                        var formData = arguments[0];
                        formData.setXHR(xhr);
                    }
                    orig.apply(xhr, arguments);
                };
            })(xhr.send);
            return xhr;
        };
    })(window.XMLHttpRequest);
}