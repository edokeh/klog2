define("angular/bootstrap/0.0.1/index-debug", [ "./modal-debug", "angularjs-debug", "./template/modal/backdrop-debug.html", "./template/modal/window-debug.html", "./dropdown-toggle-debug", "_-debug", "./pagination-debug", "./template/pagination/pagination-debug.html" ], function(require, exports, module) {
    var modal = require("./modal-debug");
    var dropdownToggle = require("./dropdown-toggle-debug");
    var pagination = require("./pagination-debug");
    module.exports = angular.module("bootstrap", [ modal.name, dropdownToggle.name, pagination.name ]);
});

define("angular/bootstrap/0.0.1/modal-debug", [ "angularjs-debug" ], function(require, exports, module) {
    var angular = require("angularjs-debug");
    angular.module("bootstrap.modal", []).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var stack = [];
                return {
                    add: function(key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function(key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function() {
                        return stack[stack.length - 1];
                    },
                    remove: function(key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function() {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function() {
                        return stack.length;
                    }
                };
            }
        };
    }).directive("modalBackdrop", [ "$modalStack", "$timeout", function($modalStack, $timeout) {
        return {
            restrict: "EA",
            replace: true,
            templateUrl: "template/modal/backdrop.html",
            link: function(scope, element, attrs) {
                //trigger CSS transitions
                $timeout(function() {
                    scope.animate = true;
                });
                scope.close = function(evt) {
                    var modal = $modalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != "static") {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $modalStack.dismiss(modal.key, "backdrop click");
                    }
                };
            }
        };
    } ]).directive("modalWindow", [ "$timeout", function($timeout) {
        return {
            restrict: "EA",
            scope: {
                index: "@"
            },
            replace: true,
            transclude: true,
            templateUrl: "template/modal/window.html",
            link: function(scope, element, attrs) {
                scope.windowClass = attrs.windowClass || "";
                //trigger CSS transitions
                $timeout(function() {
                    scope.animate = true;
                });
            }
        };
    } ]).factory("$modalStack", [ "$document", "$compile", "$rootScope", "$$stackedMap", function($document, $compile, $rootScope, $$stackedMap) {
        var backdropjqLiteEl, backdropDomEl;
        var backdropScope = $rootScope.$new(true);
        var body = $document.find("body").eq(0);
        var openedWindows = $$stackedMap.createNew();
        var $modalStack = {};
        function backdropIndex() {
            var topBackdropIndex = -1;
            var opened = openedWindows.keys();
            for (var i = 0; i < opened.length; i++) {
                if (openedWindows.get(opened[i]).value.backdrop) {
                    topBackdropIndex = i;
                }
            }
            return topBackdropIndex;
        }
        $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
            backdropScope.index = newBackdropIndex;
        });
        function removeModalWindow(modalInstance) {
            var modalWindow = openedWindows.get(modalInstance).value;
            //clean up the stack
            openedWindows.remove(modalInstance);
            //remove window DOM element
            modalWindow.modalDomEl.remove();
            //remove backdrop if no longer needed
            if (backdropDomEl && backdropIndex() == -1) {
                backdropDomEl.remove();
                backdropDomEl = undefined;
            }
            //destroy scope
            modalWindow.modalScope.$destroy();
        }
        $document.bind("keydown", function(evt) {
            var modal;
            if (evt.which === 27) {
                modal = openedWindows.top();
                if (modal && modal.value.keyboard) {
                    $rootScope.$apply(function() {
                        $modalStack.dismiss(modal.key);
                    });
                }
            }
        });
        $modalStack.open = function(modalInstance, modal) {
            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                modalScope: modal.scope,
                backdrop: modal.backdrop,
                keyboard: modal.keyboard
            });
            var angularDomEl = angular.element("<div modal-window></div>");
            angularDomEl.attr("window-class", modal.windowClass);
            angularDomEl.attr("index", openedWindows.length() - 1);
            angularDomEl.html(modal.content);
            var modalDomEl = $compile(angularDomEl)(modal.scope);
            openedWindows.top().value.modalDomEl = modalDomEl;
            body.append(modalDomEl);
            if (backdropIndex() >= 0 && !backdropDomEl) {
                backdropjqLiteEl = angular.element("<div modal-backdrop></div>");
                backdropDomEl = $compile(backdropjqLiteEl)(backdropScope);
                body.append(backdropDomEl);
            }
        };
        $modalStack.close = function(modalInstance, result) {
            var modal = openedWindows.get(modalInstance);
            if (modal) {
                modal.value.deferred.resolve(result);
                removeModalWindow(modalInstance);
            }
        };
        $modalStack.dismiss = function(modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance).value;
            if (modalWindow) {
                modalWindow.deferred.reject(reason);
                removeModalWindow(modalInstance);
            }
        };
        $modalStack.getTop = function() {
            return openedWindows.top();
        };
        return $modalStack;
    } ]).provider("$modal", function() {
        var $modalProvider = {
            options: {
                backdrop: true,
                //can be also false or 'static'
                keyboard: true
            },
            $get: [ "$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
                var $modal = {};
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) : $http.get(options.templateUrl, {
                        cache: $templateCache
                    }).then(function(result) {
                        return result.data;
                    });
                }
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function(value, key) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }
                $modal.open = function(modalOptions) {
                    var modalResultDeferred = $q.defer();
                    var modalOpenedDeferred = $q.defer();
                    //prepare an instance of a modal to be injected into controllers and returned to a caller
                    var modalInstance = {
                        result: modalResultDeferred.promise,
                        opened: modalOpenedDeferred.promise,
                        close: function(result) {
                            $modalStack.close(modalInstance, result);
                        },
                        dismiss: function(reason) {
                            $modalStack.dismiss(modalInstance, reason);
                        }
                    };
                    //merge and clean up options
                    modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                    modalOptions.resolve = modalOptions.resolve || {};
                    //verify options
                    if (!modalOptions.template && !modalOptions.templateUrl) {
                        throw new Error("One of template or templateUrl options is required.");
                    }
                    var templateAndResolvePromise = $q.all([ getTemplatePromise(modalOptions) ].concat(getResolvePromises(modalOptions.resolve)));
                    templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                        var modalScope = (modalOptions.scope || $rootScope).$new();
                        modalScope.$close = modalInstance.close;
                        modalScope.$dismiss = modalInstance.dismiss;
                        var ctrlInstance, ctrlLocals = {};
                        var resolveIter = 1;
                        //controllers
                        if (modalOptions.controller) {
                            ctrlLocals.$scope = modalScope;
                            ctrlLocals.$modalInstance = modalInstance;
                            angular.forEach(modalOptions.resolve, function(value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++];
                            });
                            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                        }
                        $modalStack.open(modalInstance, {
                            scope: modalScope,
                            deferred: modalResultDeferred,
                            content: tplAndVars[0],
                            backdrop: modalOptions.backdrop,
                            keyboard: modalOptions.keyboard,
                            windowClass: modalOptions.windowClass
                        });
                    }, function resolveError(reason) {
                        modalResultDeferred.reject(reason);
                    });
                    templateAndResolvePromise.then(function() {
                        modalOpenedDeferred.resolve(true);
                    }, function() {
                        modalOpenedDeferred.reject(false);
                    });
                    return modalInstance;
                };
                return $modal;
            } ]
        };
        return $modalProvider;
    });
    var m = angular.module("bootstrap.modal");
    m.run([ "$templateCache", function($templateCache) {
        $templateCache.put("template/modal/backdrop.html", require("angular/bootstrap/0.0.1/template/modal/backdrop-debug.html"));
        $templateCache.put("template/modal/window.html", require("angular/bootstrap/0.0.1/template/modal/window-debug.html"));
    } ]);
    module.exports = m;
});

define("angular/bootstrap/0.0.1/template/modal/backdrop-debug.html", [], '<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}" ng-click="close($event)"></div>');

define("angular/bootstrap/0.0.1/template/modal/window-debug.html", [], '<div class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10}" ng-transclude></div>');

/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 * @restrict class or attribute
 * @example:
 <li class="dropdown">
 <a class="dropdown-toggle">My Dropdown Menu</a>
 <ul class="dropdown-menu">
 <li ng-repeat="choice in dropChoices">
 <a ng-href="{{choice.href}}">{{choice.text}}</a>
 </li>
 </ul>
 </li>
 */
define("angular/bootstrap/0.0.1/dropdown-toggle-debug", [ "angularjs-debug", "_-debug" ], function(require, exports, module) {
    var angular = require("angularjs-debug");
    var _ = require("_-debug");
    angular.module("bootstrap.dropdownToggle", []).directive("dropdownToggle", [ "$document", "$location", function($document, $location) {
        var openElement = null, closeMenu = angular.noop;
        return {
            restrict: "CA",
            link: function(scope, element, attrs) {
                scope.$watch("$location.path", function() {
                    closeMenu();
                });
                element.parent().bind("click", function() {
                    closeMenu();
                });
                element.bind("click", function(event) {
                    var elementWasOpen = element === openElement;
                    event.preventDefault();
                    event.stopPropagation();
                    if (!!openElement) {
                        closeMenu();
                    }
                    if (!elementWasOpen && !element.hasClass("disabled") && !element.prop("disabled")) {
                        element.parent().addClass("open");
                        openElement = element;
                        closeMenu = function(event) {
                            if (event) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            $document.unbind("click", closeMenu);
                            element.parent().removeClass("open");
                            closeMenu = angular.noop;
                            openElement = null;
                        };
                        $document.bind("click", closeMenu);
                    }
                });
            }
        };
    } ]);
    module.exports = angular.module("bootstrap.dropdownToggle");
});

/**
 * 分页组件
 * <pagination page="xxx.$page" pagerClick="goto(page)"></pagination>
 */
define("angular/bootstrap/0.0.1/pagination-debug", [ "angularjs-debug", "_-debug" ], function(require, exports, module) {
    var angular = require("angularjs-debug");
    var _ = require("_-debug");
    angular.module("bootstrap.pagination", []).directive({
        pagination: function() {
            var WINDOW_SIZE = 2;
            var OMIT_STR = "...";
            return {
                restrict: "EA",
                replace: true,
                transclude: true,
                scope: {
                    page: "=",
                    pagerClick: "&"
                },
                templateUrl: "template/pagination/pagination.html",
                link: function(scope, element, attrs) {
                    scope.omit = OMIT_STR;
                    scope.$watchCollection("page", function(page) {
                        scope.isShow = page && page.total && page.total > 1;
                        if (scope.isShow) {
                            scope.currPage = page.current;
                            scope.totalPage = page.total;
                            // 不需要显示所有页数，只需要在当前页附近开一个“窗口”
                            scope.pages = [ 1 ];
                            if (scope.currPage > 1 + WINDOW_SIZE + 1) {
                                scope.pages.push(OMIT_STR);
                            }
                            var leftPage = Math.max(2, scope.currPage - WINDOW_SIZE);
                            var rightPage = Math.min(scope.totalPage - 1, scope.currPage + WINDOW_SIZE);
                            scope.pages = scope.pages.concat(_.range(leftPage, rightPage + 1));
                            if (scope.currPage < scope.totalPage - WINDOW_SIZE - 1) {
                                scope.pages.push(OMIT_STR);
                            }
                            scope.pages.push(scope.totalPage);
                        }
                    });
                    // 跳转
                    scope.jump = function(page) {
                        if (page > scope.totalPage || page < 1 || page === OMIT_STR) {
                            return;
                        }
                        scope.pagerClick({
                            page: page
                        });
                    };
                }
            };
        }
    });
    var m = angular.module("bootstrap.pagination");
    m.run([ "$templateCache", function($templateCache) {
        $templateCache.put("template/pagination/pagination.html", require("angular/bootstrap/0.0.1/template/pagination/pagination-debug.html"));
    } ]);
    module.exports = m;
});

define("angular/bootstrap/0.0.1/template/pagination/pagination-debug.html", [], '<ul class="pagination" ng-show="isShow">\n    <li ng-class="{disabled: currPage == 1}"><a href="" ng-click="jump(currPage-1)">上一页</a></li>\n    <li ng-repeat="page in pages track by $index" ng-class="{active: (page == currPage), disabled: (page == omit)}">\n        <a href="" ng-click="jump(page)">{{page}}</a>\n    </li>\n    <li ng-class="{disabled: currPage == totalPage}"><a href="" ng-click="jump(currPage+1)">下一页</a></li>\n</ul>');
