/**
*   此类为资源整合类，提供各种资源组合调用
*   @author }{hk date 2014/10/13
*   @class webgiscomposite
*/

define(['compositemodule', 'objutil'], function (compositemodule, objutil) {

    var extend = objutil.extend;

    var _webgisComposite = function (opts) {
        compositemodule.call(this, opts || {});
    }

    extend(_webgisComposite, compositemodule);

    _webgisComposite.prototype.inilizationComposite = function () {
        //do something
        //.......
        //
        this.constructor.__super__._iniComposite.call(this);
    }

    _webgisComposite.prototype.inilizationFunction = function () {
        //do something
        //.......
        //
        this.constructor.__super__._iniFunction.call(this);
    }

    /**
    *
    *   @控制创建四个view,包含head content foot nav
    */
    _webgisComposite.prototype.createView = function () {
        this.addView('headview', 'scripts/module/views/headview.html', 'headcontroller');
        this.addView('contentview', 'scripts/module/views/contentview.html', 'contentcontroller');
        this.addView('navview', 'scripts/module/views/navview.html', 'navcontroller');
        this.addView('messageview', 'scripts/module/views/messageview.html', 'messagecontroller');
        this.addView('footview', 'scripts/module/views/footview.html', 'footcontroller');
    }

    _webgisComposite.prototype.inilization = function () {
        this.regist('hook', this.hook);
        //视图资源
        this.inilizationComposite();
        //其他资源
        this.inilizationFunction();
    }

    _webgisComposite.prototype.getType = function () {
        return 'webgiscomposite';
    }

    return _webgisComposite;

});