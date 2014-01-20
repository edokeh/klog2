/**
 * Markdown 编辑器模块，用于其他模块
 */
define(function(require, exports, module) {
    var angular = require('angularjs');

    var editor = angular.module('editor', []);

    editor.run(require('./run/attach-extend'));

    editor.factory(require('./factory/editor'));

    editor.directive(require('./directive/selection'));
    editor.directive(require('./directive/file-drop'));

    editor.template({
        'editor/tip': require('./template/tip.html')
    });

    module.exports = editor;
});