define(function(require, exports, module) {
    var modal = require('./modal');

    module.exports = angular.module('bootstrap', [modal.name]);
});