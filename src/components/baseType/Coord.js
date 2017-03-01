/*
*   contains loglat proxy pixelxy
*   @author:yellow  date:2013/11/27
*   @class Hmap.BaseType.Coord
*/

define(function () {

    //#region 经纬度坐标 Loglat

    /**
    *   经纬度表示
    *  @class Hmap.BaseType.Loglat
    */
    var _loglat = function (log, lat) {
        this.log = log || 0;
        this.lat = lat || 0;

    }
    //静态函数
    _loglat.fromArray = function (array) {
        if (Object.prototype.toString.call(array) === '[object Array]') {
            return new _loglat(array[0], array[1]);
        }
    }
    _loglat.prototype.toArray = function () {
        return [this.log, this.lat];
    }
    _loglat.prototype.getType = function () {
        return "Loglat";
    }
    //#endregion

    //#region 投影坐标 proXY

    /**
    *   投影坐标表示
    *  @class Hmap.BaseType.ProXY
    */
    var _proXY = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    _proXY.fromArray = function (array) {
        if (Object.prototype.toString.call(array) === "[object Array]") {
            return new _proXY(array[0], array[1]);
        }
    }
    _proXY.prototype.toArray = function () {
        return [this.x, this.y];
    }
    _proXY.prototype.getType = function () {
        return "ProXY";
    }
    //#endregion

    //#region 屏幕像素坐标

    /**
    *   屏幕像素坐标表示
    *   @class Hmap.BaseType.PixelXY
    */
    var _pixelXY = function () {
        
    }
    _pixelXY.prototype.getType = function () {
        return 'PixelXY';
    }
    //#endregion

    return {
        Loglat: _loglat,
        ProXY: _proXY,
        PixelXY:_pixelXY,
    }

});