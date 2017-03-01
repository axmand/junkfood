/**
*   @author }{hk date 2014/10/14
*   @class footmodule
*/

define(['basemodule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _footModule = function (opts) {
        basemodule.call(this, opts || {});
    }

    extend(_footModule, basemodule);

    _footModule.prototype.createMap = function () {

    }

    _footModule.prototype.createLayer = function () {

    }

    _footModule.prototype.createCommand = function () {

    }

    _footModule.prototype.createView = function () {

    }

    _footModule.prototype.getType = function () {
        return 'footmodule';
    }

    return _footModule;

});