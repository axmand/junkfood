/**
*   @author:yellow date:2013/11/26
*   func:实现3857投影（web mercator）
*   EPSG:3857, EPSG:900913, EPSG:102113, EPSG:102100 OSGEO:41001.
*   等效于3857投影
*   3857解释：
*   web地图投影均采用3857投影，与4326投影的关系为，
*   4326以经纬度直接表示投影坐标，4326相当于3857的大地坐标
*   inverseMeractor 方法类似将3857投影转为wgs84 4326   单位：degree
*   forwardMeractor 方法类似将wgs84 4326转换为3857投影坐标 单位：meter
*   @class epsg3857
*/

define(['Coord'], function (Coord) {

    var pole = 20037508.3427892,   //地球赤道半周长
        mercator = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100", "OSGEO:41001"]; //墨卡托投影

    var _epsg3857 = function () {
        //获取地球半周长
        this.pole = function () {
            return pole;
        }
        //投影坐标转大地坐标
        //@param   proXY { x  //投影x ,y   //投影y }
        //@return   loglat{log //经度,lat //纬度 }
        this.inverseMeractor = function (proXY) {
            var log = 180 * proXY.x / pole;
            var lat = 180 / Math.PI * (2 * Math.atan(Math.exp((proXY.y / pole) * Math.PI)) - Math.PI / 2);
            return new Coord.Loglat(log, lat);;
        }
        //大地坐标转投影坐标
        //@param loglat{log //经度,lat //纬度 }
        //@return proXY { x  //投影x ,y   //投影y }
        this.forwardMeractor = function (loglat) {
            var px = loglat.log * pole / 180;
            var y = Math.log(Math.tan((90 + loglat.lat) * Math.PI / 360)) / Math.PI * pole;
            var py = Math.max(-pole, Math.min(y, pole));
            return new Coord.ProXY(px, py);
        }
    }

    _epsg3857.prototype.getResolution = function () {
        return {
            value: 111,
            unit:"平方千米",
        }
    }

    /**
    *   获取投影编号（EPSG:****）
    *   @method getType
    */
    _epsg3857.prototype.getType = function () {
        return "EPSG:3857";
    }

    var epse3857= new _epsg3857();

    return epse3857;

});