/**
*   模块组件抽象定义，根据功能或者展示区域划分模块，可自行继承实现
*   @author }{hk date 2014/10/13
*   @class  basemodule
*   @description
*   var module=new _baseModule({
*       app:
*       cmds:
*   });
*/
define(function () {

    var _baseModule = function (opts) {
        var _opts = opts || {};
        this.hook = _opts.hook || {};
        this.container={};
        this.app = _opts.app;
        this.cmds = _opts.cmds;
    }

    /**
    *   远程读取/写入配置文件
    *   @method configure
    *   @abstract
    */
    _baseModule.prototype.configure = function () {

    }

    /**
    *   远程启动/关闭服务器分析能力,例如开启并连接空间分析服务，插值算法服务等
    *   @method createService
    *   @abstract
    */
    _baseModule.prototype.createService = function () {

    }

    /**
    *   注册command，页面功能区域都是command组成，需要注册后添加进系统使用
    *   @method createCommand
    *   @abstract
    */
    _baseModule.prototype.createCommand = function () {

    }

    /**
    *   在module里提供regist功能，并存放到app里，
    *   本质上就是一个dictionary
    *   @method regist
    */
    _baseModule.prototype.regist = function (name, obj) {
        this.container[name] = obj;
        //将名值对添加进对angular模块组里
        this.app.addService(name, obj);
    }

    /**
    *   移除名值对注册
    *   @mehtod unregist
    */
    _baseModule.prototype.unregist = function (name) {

    }

    _baseModule.prototype.resolve = function (name) {
        return this.container[name];
    }

    /**
    *   添加command
    *   @method addCommand
    */
    _baseModule.prototype.addCommand = function (command) {
        this.cmds.add(command);
    }

    _baseModule.prototype.addView = function (name,url,controller) {
        this.app.addView(name, url, controller);
    }

    _baseModule.prototype.getType = function () {
        return 'basemodule';
    }

    return _baseModule;

});