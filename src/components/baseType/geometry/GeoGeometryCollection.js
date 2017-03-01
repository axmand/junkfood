/**
*   几何对象集合
*   @author yellow date 2014.10/17
*   @class GeoGeometryCollection
*
*      { "type": "GeometryCollection",
*         "geometries": [
*            { "type": "Point",
*              "coordinates": [100.0, 0.0]
*            },
*            { "type": "LineString",
*              "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
*            }
*            ]
*       }
*
*/
define([], function () {

    var _geoGeometryCollection = function () {

    }

    _geoGeometryCollection.prototype.add = function () {

    }

    _geoGeometryCollection.prototype.remove = function () {

    }

    _geoGeometryCollection.prototype.getType = function () {
        return 'GeoGeometryCollection';
    }

});