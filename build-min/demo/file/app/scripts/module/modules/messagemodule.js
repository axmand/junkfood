/**
*   @author }{hk date 2014/10/14
*   @class messagemodule
*/

define(['basemodule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _messageModule = function (opts) {
        basemodule.call(this, opts || {});
    }

    extend(_messageModule, basemodule);

    _messageModule.prototype.createMap = function () {

    }

    _messageModule.prototype.createLayer = function () {

    }

    _messageModule.prototype.createCommand = function () {

    }

    _messageModule.prototype.createView = function () {

    }

    _messageModule.prototype.getType = function () {
        return 'messagemodule';
    }

    return _messageModule;

});