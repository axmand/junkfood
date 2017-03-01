/// <reference path="../../../build/require.js" />
/*
*   定义canvaslayer，提供layer的绘制方法，事件注册等
*   主要用来逻辑管理mesh
*/
define(function () {
    /*
    *   @param args
    *   baselayer为共享设计，所以参数应该为共享参数
    *   {  }
    */
    var _bsclayer = function (args) {
        //合并args
        this.args = args || {};
        this.objects = [];//objects是存放模型/瓦片的容器
        var that = this;
        //callback
        this.MapObjCallback = function (copyElements) {
            //这里传递给thr3d的回调，在此之前可以做其他的操作
            that.subscribe(copyElements);
        }
        this.args.mapObjcallback = this.MapObjCallback;
        this.subscribe = null;
        this.type = {
            esri: "esri",
            baidu: "baidu",
            mapabc: "mapabc",
            tmap: "tmap"
        }
    }

    //分发，通知
    _bsclayer.prototype.notice = function (copyElements) {
    }

    //合并参数，不覆盖
    _bsclayer.prototype._mergeargs = function (args) {
        //合并args
        for (var item in args) {
            if (this.args[item] === undefined) {
                this.args[item] = args[item];
            }
        }
    }

    //提供对外的标准接口，发布事件启动
    _bsclayer.prototype.Publish = function () {
    }

    _bsclayer.prototype.Move = function (offsetX, offsetY) {
    }

    _bsclayer.prototype.Zoom = function (zoom) {
    }

    return{
        self:_bsclayer
    }
    
});

