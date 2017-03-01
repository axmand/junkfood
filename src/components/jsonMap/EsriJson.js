/**
*   esri json格式解析，转化为geojson格式兼容的geometry对象
*   @class Hmap.JsonMap.EsriJson
*/
define(['BaseJson', 'Hobject'], function (BaseJson, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    /**
    *   @param args
    *   {
    *       url:                 //通过url获取geojson
    *   }
    */
    var _esriJson = function (args) {
        BaseJson.call(this, args);
    }

    extend(_esriJson, BaseJson);

    //默认完成后的回调，提供函数可被复写
    _esriJson.prototype.jsonComplete = function (data, type) {
        var features = data.features || [];
        this.complete(features, type);
    }

    _esriJson.prototype.getType = function () {
        return 'EsriJson';
    }

    return _esriJson;

});