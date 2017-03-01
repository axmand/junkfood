/**
*   1. 解析 geojson 格式的矢量数据，提供最简化json
*   2. 对geometry的操作保存起来
*   @class Hmap.JsonMap.GeoJson
*/

define(['BaseJson', 'Hobject'], function (BaseJson, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    /*  @param args {Object}
    *   {
    *       url:                 //通过url获取geojson
    *       complete:      // function 加载成功后的回调
    *   }
    */
    var _geoJson = function (args) {
        //几何图形类型为
        this.GeoType = {
            Point: "Point",
            LineString: "LineString",
            Polygon: "Polygon",
            MultiPoint: "MultiPoint",
            MultiLineString: "MultiLineString",
            MultiPolygon: "MultiPolygon",
        }
        this.complete = args.complete || function () { };
        this.JsonInfo = {};                               //json 信息
        this.Features = null;                           //要素集合
        BaseJson.call(this,args);
    }

    extend(_geoJson, BaseJson);

    //覆写complete
    //@params data 为json对象
    /*  {
    *       data:  //内包含geojson或者esrijson
    *       type:   // "esrijson" 或 "geojson"
    *       info:   {
                            date:       //生成时间
                            size:        //大小
                       }
    *    }
    */
    _geoJson.prototype.jsonComplete = function (data,type) {
        var _data = data.data || data;
        this.Features = _data.features||_data.Features;                                  //type array
        this.JsonInfo = _data.info||"N/A";
        this.complete(this.Features, type);                                    //回调features
    }

    _geoJson.prototype.getType = function () {
        return "GeoJson";
    }

    return _geoJson;

});