/*
*   author:yellow date:2013/9/25
*   func:提供基础:获取/序列化json的方法
*   @class Hmap.JsonMap.BaseJson
*/

define(['Jsonp'], function (Jsonp) {
    /*
    *   @param args
    *   {
	*       url:
    *       jsondata:
    *       info
    *   }
    */
    var _baseJson = function (args) {
        var _args = args || {};
        this.url = _args.url || null;
        this.info = _args.info;
        this.jsonData = _args.jsondata ||null;
        this.complete = _args.complete;
        if (!!this.jsonData) {                     //直接传递jsonData
            this.jsonComplete(this.jsonData, this.getType());
        }
        else if (!!this.url) {
            this.loadJson(this.url);
        }
        
    }

    //url方式异步获取json数据
    _baseJson.prototype.loadJson = function (url) {
        var that = this;
        Jsonp.getJson(url, null, function (data) {
            that.jsonComplete(data, that.getType());
        });
    }

    //默认完成后的回调，提供函数可被复写
    _baseJson.prototype.jsonComplete = function (data,type) {
        this.complete(data, type);
    }

    _baseJson.prototype.getType = function () {
        return "BaseJson";
    }

    return _baseJson;

});