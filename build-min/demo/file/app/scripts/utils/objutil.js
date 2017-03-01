/**
*   提供对象的基本功能 ,包括继承,判断等
*   @author }{hk date 2014/10/14
*   @class objectUtils
*/
define(function () {

    var _objUtil = function () {

    }

    _objUtil.extend = function (child, parent) {
        for (var key in parent.prototype) {
            if (!(key in child.prototype)) {
                child.prototype[key] = parent.prototype[key];
            }
        }
        child.__super__ = parent.prototype;
        return child;
    }

    return _objUtil;

});