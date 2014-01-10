/**
 * popover 需要使用者提供触发器与 Popover 元素
 *
 * <a popover-trigger="myTrigger" popover-show="isShow"></a>
 * <div popover-window="myTrigger"></div>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    module.exports = {
        /**
         * 触发器，也可通过 popover-show 双向绑定属性来手工触发
         */
        'popoverTrigger': ['$parse', function($parse) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var isShow = false;
                    var triggerGetter = $parse(attrs.popoverTrigger);
                    var showGetter = $parse(attrs.popoverShow);


                    scope.$watch(function(scope) {
                        return scope.$eval(attrs.popoverTrigger);
                    }, function(value) {
                        triggerGetter.assign(scope, value);
                        isShow= !!value;
                        if (attrs.popoverShow) {
                            showGetter.assign(scope, isShow);
                        }
                    });

                    // popover-show 属性的双向绑定
                    scope.$watch(function(scope) {
                        return scope.$eval(attrs.popoverShow);
                    }, function(value) {
                        triggerGetter.assign(scope, !!value ? element : null);
                    });

                    // toggle
                    element.on('click', function() {
                        triggerGetter.assign(scope, !isShow ? element : null);
                        scope.$apply();
                    });
                }
            };
        }],

        /**
         * 实际的 Popover 元素
         */
        'popoverWindow': ['$document', '$parse', function($document, $parse) {
            return {
                restrict: 'CA',
                link: function(scope, element, attrs) {
                    var trigger;

                    scope.$watch(function(scope) {
                        return scope.$eval(attrs.popoverWindow);
                    }, function(value) {
                        // 一旦有了 trigger，立刻计算位置并显示
                        if (angular.isElement(value)) {
                            trigger = value;
                            var placement = element.hasClass('top') ? 'top' : element.hasClass('bottom') ? 'bottom' : 'top';
                            element.css('display', 'block');

                            // 根据 trigger 计算新的位置
                            var width = element[0].offsetWidth;
                            var height = element[0].offsetHeight;
                            var triggerPos = position(trigger);
                            var triggerWidth = outerOffset(trigger, 'width');
                            var triggerHeight = outerOffset(trigger, 'height');
                            var left = triggerPos.left - width / 2 + outerOffset(trigger, 'width') / 2;
                            var top = triggerPos.top;
                            if (placement === 'top') {
                                top = top - height - 5;
                            }
                            else {
                                top = top + triggerHeight + 5;
                            }

                            element.css({
                                left: left + 'px',
                                top: top + 'px'
                            }).addClass('in');
                        }
                        else {
                            element.css('display', 'none').removeClass('in');
                            trigger = null;
                        }
                    });

                    // 点击其他地方时隐藏
                    $document.find('body').on('click', function(e) {
                        if (!trigger || (containsOrIs(trigger[0], e.target) || containsOrIs(element[0], e.target))) {
                            return;
                        }
                        $parse(attrs.popoverWindow).assign(scope, null);
                        scope.$apply();
                    });

                    // 销毁时解除绑定
                    element.on('$destroy', function() {
                        $document.find('body').off('click');
                    });

                    function containsOrIs(parent, child) {
                        return parent === child || parent.contains(child);
                    }
                }
            };
        }]
    };

    function position(element) {
        var offset = element[0].getBoundingClientRect();
        var offsetParent = element[0].offsetParent;
        var parentOffset = offsetParent.getBoundingClientRect();

        // Add offsetParent borders
        parentOffset.top += parseInt(angular.element(offsetParent).css('borderTopWidth') || 0, 10);
        parentOffset.left += parseInt(angular.element(offsetParent).css('borderLeftWidth') || 0, 10);

        // Subtract parent offsets and element margins
        return {
            top: offset.top - parentOffset.top - parseInt(element.css('marginTop') || 0, 10),
            left: offset.left - parentOffset.left - parseInt(element.css('marginLeft') || 0, 10)
        };
    }

    // outerHeight, outerWidth
    function outerOffset(element, type) {
        type = type[0].toUpperCase() + type.substr(1);
        var val = element[0]['offset' + type];

        return val;
    }
});