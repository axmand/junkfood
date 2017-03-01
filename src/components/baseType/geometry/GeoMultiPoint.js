/**
*   
*   @author yelllow date 2014/10/17
*   @class GeoMultiPoint
*   { "type": "MultiPoint",
*      "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
*    }
*/
define(['GeoGeometry','Bound','Hobject'], 
    function (GeoGeometry,Bound,Hobject){

        var extend=Hobject.BaseFunc.extend;

        var _geoMultiPoint = function (args) {

        }

        extend(_geoMultiPoint, GeoGeometry);

        _geoMultiPoint.prototype._iniCenter = function () {

        }

        _geoMultiPoint.prototype._iniBound = function () {
            var i, len = this.coordinates.length;
            var top = 0, left = 0, right = 0, bottom = 0;
            //
            if (this.coordinates.dim() === 2) {

            }
            //
            return new Bound(top, left, bottom, right);
        }

        _geoMultiPoint.prototype.getType = function () {
            return 'GeoMultiPoint';
        }

    });