/**
 * textarea/input text 的光标位置
 */
define(function (require, exports, module) {
    var selection = require('gallery/selection/0.9.0/selection');

    module.exports = {
        'cursor': ['$interval', '$parse', function ($interval, $parse) {
            return {
                restrict: 'CA',
                link: function (scope, element, attrs) {
                    var timer;
                    var sel = selection(element[0]);
                    var getter = $parse(attrs.cursor);

                    element.on('focus', function () {
                        timer = $interval(function () {
                            getter.assign(scope, sel.cursor());
                        }, 500);
                    });

                    element.on('blur', function () {
                        $interval.cancel(timer);
                    })
                }
            };
        }]
    };
});