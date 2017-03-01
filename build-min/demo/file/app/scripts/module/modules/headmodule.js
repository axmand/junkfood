/**
*   @author }{hk date 2014/10/14
*   @class headmodule
*/

define(['basemodule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _headModule = function (opts) {
        basemodule.call(this, opts || {});
    }

    extend(_headModule, basemodule);

    _headModule.prototype.createMap = function () {

    }

    _headModule.prototype.createLayer = function () {

    }

    _headModule.prototype.createCommand = function () {

    }

    _headModule.prototype.createView = function () {

    }

    _headModule.prototype.getType = function () {
        return 'headmodule';
    }

    return _headModule;

});