/**
*   MultiPolygon类型,遵循geojson规范的multiPolygon
*   @class Hmap.Geometry.GeoMultiPolygon
*   @author yellow date 2014/9/12
*   { "type": "MultiPolygon",
*    "coordinates": [
*      [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
*      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
*       [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
*      ]
*    }
*/

define(['Hobject', 'GeoGeometry', 'Bound', 'GeoPolygon'], function (Hobject, GeoGeometry, Bound, GeoPolygon) {

    var extend = Hobject.BaseFunc.extend;

    var _geoMultiPolygon = function (args) {
        this.polygons = []; //存储polygon集合
        GeoGeometry.call(this, args);
    }

    extend(_geoMultiPolygon, GeoGeometry);

    //有多个polygon的时候，返回各个polygon的中心，
    //此时this.center为数组
    _geoMultiPolygon.prototype._iniCenter = function () {

    }

    _geoMultiPolygon.prototype._iniBound = function () {
        var i, len = this.coordinates.length, polygon, bound;
        for (i = 0; i < len; i++) {
            coord = this.coordinates[i];
            polygon = GeoPolygon.fromCoordinates(coord);
            bound = !bound ? polygon.bound : bound.concat(polygon.bound);
            this.polygons.push(polygon);
        }
        return bound;
    }

    _geoMultiPolygon.prototype.geoArea = function () {
        var i, len = this.polygons.length, polygon, area=0;
        for (i = 0; i < len; i++) {
            polygon = this.polygons[i];
            area+= polygon.geoArea();
        }
        return area * this.projection.getResolution().value * this.projection.getResolution().value + this.projection.getResolution().unit;
    }

    _geoMultiPolygon.fromGeoGeometry = function (geometry) {
        return new _geoMultiPolygon({
            coordinates:geometry.coordinates,
        });
    }

    _geoMultiPolygon.fromEsriGeometry = function (esriGeometry) {
        return new _geoMultiPolygon({
            coordinates: [esriGeometry],
        });
    }

    _geoMultiPolygon.prototype.getType = function () {
        return "GeoMultiPolygon";
    }

    return _geoMultiPolygon;
});