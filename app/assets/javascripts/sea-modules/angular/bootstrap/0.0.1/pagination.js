/**
 * 分页组件
 * <pagination page="xxx.$page" pagerClick="goto(page)"></pagination>
 */
define(function(require, exports, module) {
    var angular = require('angularjs');
    var _ = require('_');

    angular.module('bootstrap.pagination', [])
        .directive({
            'pagination': function() {
                var WINDOW_SIZE = 2;
                var OMIT_STR = '...';

                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    scope: {
                        page: '=',
                        pagerClick: '&'
                    },
                    templateUrl: 'template/pagination/pagination.html',

                    link: function(scope, element, attrs) {
                        scope.omit = OMIT_STR;

                        scope.$watchCollection('page', function(page) {
                            scope.isShow = page && page.total && page.total > 1;
                            if (scope.isShow) {
                                scope.currPage = page.current;
                                scope.totalPage = page.total;

                                // 不需要显示所有页数，只需要在当前页附近开一个“窗口”
                                scope.pages = [1];
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
                            scope.pagerClick({page: page});
                        };
                    }
                };
            }
        });

    var m = angular.module('bootstrap.pagination');

    m.run(['$templateCache', function($templateCache) {
        $templateCache.put('template/pagination/pagination.html', require('./template/pagination/pagination.html'));
    }]);

    module.exports = m;
});