/**
*   组织module
*   @author }{hk date 2014/10/13
*   @class compositemodule
*/
define(['basemodule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _compositeModule = function (opts) {
        basemodule.call(this, opts || {});
        this.modules = [];
    }

    extend(_compositeModule, basemodule);

    _compositeModule.prototype.add = function (module) {
        this.modules.push(module);
    }

    _compositeModule.prototype.configure = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].configure();
    }

    _compositeModule.prototype.createView = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createView();
    }

    _compositeModule.prototype.createService = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createService();
    }

    _compositeModule.prototype.createCommand = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createCommand();
    }

    _compositeModule.prototype.getType = function () {
        return 'compositemodule';
    }

    /**
    *
    *   初始化界面ui,保证domready
    */
    _compositeModule.prototype._iniComposite = function () {
        this.configure();
        this.createView();
    }

    /**
    *   初始化功能api,需要在composite后执行
    */
    _compositeModule.prototype._iniFunction = function () {
        this.createService();
        this.createCommand();
        this.cmds.onCreate(this.hook);
    }

    return _compositeModule;

});