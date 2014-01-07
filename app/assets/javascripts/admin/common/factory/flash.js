/**
 * 用于在 route 之间传递消息的组件，类似 Rails 的 flash
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        'Flash': function() {
            var Flash = {};
            var flashMsg = {};

            // getter/setter
            angular.forEach(['success', 'error', 'tmp'], function(key) {
                Flash[key] = function(value) {
                    if (value) {
                        flashMsg[key] = value;
                    }
                    else {
                        var tmp = flashMsg[key];
                        delete flashMsg[key];
                        return tmp;
                    }
                };
            });
            return Flash;
        }
    };
});