/**
*   事件管理模块
*   @author:yellow
*   @modules  Hmap.Core.EventListener
*/

define(function () {

    var _eventListener = function () {

    }
    /**
    *   添加事件绑定
    *   @method AddListener
    *   @param {DOM} element 待绑定事件的元素
    *   @param {String} evt 事件名称
    *   @param {Function} fn 处理函数
    */
    _eventListener.addListener = function (element, evt, fn) {
        //支持addEventListener
        if (element.addEventListener) {
            element.addEventListener(evt, fn, false);
        }
            //支持attachEvent
        else if (element.attachEvent) {
            element.attachEvent('on' + evt, fn);
        }
            //on 方法
        else {
            element['on' + evt] = fn;
        }
    };
    /**
     *   移除事件绑定
     *   @method RemoveListener
     *   @param {DOM} element 待绑定事件的元素
     *   @param {String} evt 事件名称
     *   @param {Function} fn 处理函数
     */
    _eventListener.removeListener = function (element, evt, fn) {
        //支持addEventListener
        if (element.removeEventListener) {
            element.removeEventListener(evt, fn, false);
        }
            //支持attachEvent
        else if (element.detachEvent) {
            element.detachEvent('on' + evt, fn);
        }
            //on 方法
        else {
            element['on' + evt] = null;
        }
    };

    return {
        AddListener: _eventListener.addListener,
        RemoveListener: _eventListener.removeListener,
    }

});