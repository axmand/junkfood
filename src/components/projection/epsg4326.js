/**
*   func:4326 投影介绍
*   确切的来说，4326并不是一种投影，它是基于WGS 84的大地坐标
*   所有采用WGS 84 参考椭球体的投影坐标都应该能通过4326提供的
*   大地坐标算投影坐标,也可以通过投影坐标算对应WGS 84的大地坐标
*          4326 存在的价值
*          在jsapi中，将前端的投影坐标转换回4326大地坐标，可以讲大地
*   坐标回传到服务端进行地理统计分析。不需要做投影变换和参考椭球体
*   的变换
*   @class epsg 4326
*   @author:yellow   date:2013/11/26
*/


define(['epsg3857'], function (epsg3857) {

    //top,left,bottom,right
    var bound = [85.05112878,];

    var meter = 111194.872221777;  //赤道上一 “ ° ”代表的米数

    var _epsg4326 = function (loglat) {
        //转换成3857坐标系下坐标
        this.toEpsg3857 = function () {
            return epsg3857.self.forwardMeractor;
        }
        //从3857转换到4326
        this.fromEpsg3857 = function () {
            return epsg3857.self.inverseMeractor;
        }
        //度换算成米单位
        this.getMeterPerDegree = function () {
            return meter;
        }
        //经纬度换算成屏幕坐标
        this.toPixelXY = function () {

        }
    }

    /**
    *   获取投影编号（EPSG:****）
    *   @method getType
    */
    _epsg4326.prototype.getType = function () {
        return "EPSG:4326";
    }

    var epsg4326 = new _epsg4326();
    
    return epsg4326;

});