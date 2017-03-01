/**
 *  点状集合,遵循geojson规范
 *  @class Hmap.Geometry.GeoPoint
 *   { "type": "Point", "coordinates": [100.0, 0.0] }
 */

define(['GeoGeometry', 'Bound', 'Hobject'], function (GeoGeometry, Bound, Hobject) {

    var extend = Hobject.BaseFunc.extend;   //扩展此方法

    var _geoPoint = function (args) {
        var _args = args || {};
        GeoGeometry.call(this, _args);
    }

    extend(_geoPoint, GeoGeometry);

    _geoPoint.fromGeoGeometry = function (geoGeometry) {
        return new _geoPoint({
            coordinates: geoGeometry.coordinates,
        });
    }

    _geoPoint.fromEsriGeometry = function (esriGeometry) {
        return new _geoPoint({
            coordinates: [[esriGeometry.x, esriGeometry.y]],
        });
    }

    /**
    *   从坐标数组生成GeoPoint
    *   @method fromCoord
    *   @param Coord {Array} 点格式形如 [ [0,0] ]
    */
    _geoPoint.fromCoord = function (coord) {
        return new _geoPoint({
            coordinates: coord,
        });
    }

    /*
     * 覆写点状要素的bound算法
     * 形如： { "type": "Point", "coordinates": [100.0, 0.0] } 
     */
    _geoPoint.prototype._iniBound = function () {
        var i, len = this.coordinates.length;
        var top = 0, left = 0, right = 0, bottom = 0;
        //每个点都是一个feature、而且恰好只有一个点
        top = bottom = this.coordinates[0][1];
        left = right = this.coordinates[0][0];
        return new Bound(top, left, bottom, right);
    }

    _geoPoint.prototype.getType = function () {
        return 'GeoPoint';
    }

    return _geoPoint;

});