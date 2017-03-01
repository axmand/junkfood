/**
 *  @author yellow date:2014/5/7
 *  @description 地图消息弹框，提示用户消息状态
 *  @class Hmap.Core.Messenger
 *  用法 Messenger.getInstance().post("数据传输中...");
 */

define(['Hobject'], function (Hobject) {
        //underscoire.js 改写后的extend,附带__spuer__和ctor
    var extend = Hobject.BaseFunc.extend,
        isObject = Hobject.BaseFunc.isObject,
        result = Hobject.BaseFunc.result,
        merge = Hobject.BaseFunc.merge; //合并参数
        ////backbones.js 
        //events = Hobject.Events;
        //默认样式
    var defaultOpts = {
        extraClasses: 'messenger messenger-fixed messenger-on-top messenger-on-left',
        theme: 'future',
        maxMessages: 1,
        parentLocation: 'body',
        },
        defaultMsgOpts = {
            extraClasses: 'messenger-message message alert ',
            hideAfer: 3000,
            message: "",
            type: 'info',
            scroll: true,
            closeButtonText:"&times;",
        };

    var context = null,
        lastMsg = "", //记录上一次msg内容
        clearMsg = null;
    /**
     * @class message
     * @param opts
     * {
     *      parentLocation:
     * }
     */
    var _message = function (opts) {
        var _opts = opts || {};
        _opts = merge(defaultOpts, _opts); //合并参数
        this.optExtraClasses = "";//css 类集合
        this.msgOptExtraClasses =null; //msg css集合
        this.theme = " messenger-theme-"; //主题风格，根据theme字段定
        this.parent = null;
        this.hideAfter = null;
        this.ul = null;
        this.history = []; //历史消息
        this.maxMessages=null;
        this.inilization(_opts);
    }

    _message.prototype.inilization = function (opts) {
        //获取父容器
        this.parent = isObject(opts.parentLocation) ? opts.parentLocation : document.getElementById(opts.parentLocation) || (document.getElementsByTagName(opts.parentLocation))[0];
        this.theme += opts.theme;   //message 主题风格
        this.maxMessages = opts.maxMessages || 1;
        this.optExtraClasses += opts.extraClasses;  //主要css类
        //
        this.ul = document.createElement('ul');
        this.ul.className = this.optExtraClasses + this.theme;
        this.ul.style.border = '0px solid black';
        var msgDiv = document.createElement('div');
        msgDiv.style.height = '38px';
        msgDiv.appendChild(this.ul);
        this.parent.appendChild(msgDiv);
    }
    //把message投入li列里
    _message.prototype._reserveMessageSlot = function (msg) {
            var li = document.createElement('li');
            li.className = 'messenger-message-slot';
            var template = this.template({ message: msg });
            li.appendChild(template);
            this.history.push(template);
            this.ul.appendChild(li);
    }

    _message.prototype.template = function (opts) {
        var message = document.createElement('div');
        opts = merge(defaultMsgOpts, opts);
        this.msgOptExtraClasses =this.msgOptExtraClasses|| opts.extraClasses;
        this.hideAfter = opts.hideAfer || 3000;   //3秒后自动关闭
        //消息弹出框
        var alertType = opts.type + " message-" + opts.type + " alert-" + opts.type,
         msgOptCalsses = this.msgOptExtraClasses + alertType;
        message.className=msgOptCalsses;
        //消息内容
        var text = document.createElement('div');
        text.className = 'messenger-message-inner';
        text.innerText = opts.message;
        //spinner
        var spinner = document.createElement('div');
        spinner.className = 'messenger-spinner';
        for (var i = 1; i <=2; i++) {
            var span = document.createElement('span');
            span.className = i === 1 ? 'messenger-spinner-side messenger-spinner-side-left' : 'messenger-spinner-side messenger-spinner-side-right';
            var span2 = document.createElement('span');
            span.appendChild(span2);
            spinner.appendChild(span);
        }
        message.appendChild(text);
        message.appendChild(spinner);
        return message;
    }

    _message.prototype.post = function (msg) {
        var that = this;
        //清除上一次延时关闭消息框
        clearTimeout(clearMsg);
        !!this.history[this.history.length - 1] ? this._hide(this.history[this.history.length - 1]) : null;
        this._reserveMessageSlot(msg);
        //新添加延时关闭消息框
        clearMsg=setTimeout(function () {
            that._hide();
        }, this.hideAfter);
    }

    _message.prototype._show = function () {

    }

    _message.prototype._hide = function (template) {
        template = !!template ? template : this.history[this.history.length - 1];
        template.className+= ' messenger-hidden';//隐藏template
    }
    //设置实例
    _message.setInstance = function (ins) {
        context = ins;
    }
    //获取实例
    _message.getInstance = function () {
        return context;
    }

    return _message;

});