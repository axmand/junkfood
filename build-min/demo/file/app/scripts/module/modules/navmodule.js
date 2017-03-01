/**
*   @author }{hk date 2014/10/14
*   @class navmodule
*/

define(['basemodule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _navModule = function (opts) {
        basemodule.call(this, opts || {});
    }

    extend(_navModule, basemodule);

    _navModule.prototype.createMap = function () {

    }

    _navModule.prototype.createLayer = function () {

    }

    _navModule.prototype.createCommand = function () {

    }

    _navModule.prototype.createView = function () {

    }

    _navModule.prototype.getType = function () {
        return 'navmodule';
    }

    return _navModule;

});