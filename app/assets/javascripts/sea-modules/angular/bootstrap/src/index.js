define(function(require, exports, module) {
    var modal = require('./modal');
    var dropdownToggle = require('./dropdown-toggle');
    var pagination = require('./pagination');

    module.exports = angular.module('bootstrap', [modal.name, dropdownToggle.name, pagination.name]);
});