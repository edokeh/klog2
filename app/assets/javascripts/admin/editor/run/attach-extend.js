/**
 * 给现有的 Attach 增加方法
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = ['Attach', '$resource', function(Attach, $resource) {

        // attach 对应的 Markdown code
        Attach.prototype.getCode = function() {
            var url = 'http://' + location.host + this.url;
            var code;
            if (this.is_image) {
                code = '![](' + url + ')';
            }
            else {
                code = '[' + this.file_name + '](' + url + ')';
            }
            return code;
        };
    }];
});