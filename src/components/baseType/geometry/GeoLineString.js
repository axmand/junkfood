/**
*   GeoLineString,遵循geojson规范
*   @class Hmap.Geometry.GeoLineString
*   @author yellow date:2014/9/12
*   { "type": "MultiLineString",
*       "coordinates": [
*        [ [100.0, 0.0], [101.0, 1.0] ],
*        [ [102.0, 2.0], [103.0, 3.0] ]
*      ]
*    }
*/
define(['GeoGeometry', 'Bound', 'Hobject','Hmath'], function (GeoGeometry, Bound, Hobject,Hmath) {
        //扩展此方法
    var extend = Hobject.BaseFunc.extend,
        proDistance = Hmath.mH2dmath.proDistance,
        isArray = Hobject.BaseFunc.isArray;

    var _geoLineString = function (args) {
        var _args = args || {};
        GeoGeometry.call(this, _args);
    }

    extend(_geoLineString, GeoGeometry);

    _geoLineString.fromGeoGeometry = function (geoGeometry) {
        return new _geoLineString({
            coordinates: [geoGeometry.coordinates],
        });
    }

    _geoLineString.fromEsriGeometry = function (esriGeometry) {
        return new _geoLineString({
            coordinates: esriGeometry,
        });
    }
    
     // 覆写线状要素bound计算
     // 形如 { "type": "LineString",coordinates": [ [100.0, 0.0], [101.0, 1.0] ]｝    
    _geoLineString.prototype._iniBound = function () {
        var len = this.coordinates.length, i, coord,log,lat,
            top, left, right, bottom;
        for (i = 0; i < len; i++) {
            //点的集合
            coord = this.coordinates[i];
            lat = coord[1];
            log = coord[0];
            if (!top) {
                top = bottom = lat;
                left = right = log;
            }
            else {
                top = top > lat ? top : lat;
                bottom = bottom < lat ? bottom : lat;
                left = left < log ? left : log;
                right = right > log ? right : log;
            }
        }
        return new Bound(top, left, bottom, right);
    }

    //计算Polygon中心点，采用向量法
    _geoLineString.prototype._iniCenter = function () {
        return this.bound.center();
    }

    /**
    *   计算lineString的长度
    *   @method geoLength
    */
    _geoLineString.prototype.geoLength = function () {
        var length = 0;
        var len = this.coordinates.length - 1, i, coord0, coord1;
        for (i = 0; i < len; i++) {
            //点的集合
            coord0 = this.coordinates[i];
            coord1 = this.coordinates[i + 1];
            length += proDistance(coord0,coord1);
        }
        return length;
    }

    /**
    *   为折线添加点
    *   @method addPoint
    */
    _geoLineString.prototype.addPoint = function (point) {
        isArray(point)?this.coordinates.push(point):null;
    }

    /**
    *   替换指定点为给定的point
    *   @method replacePoint
    *   @param point {Array}
    *   @param index {Number}
    */
    _geoLineString.prototype.replacePoint = function (point, index) {
        if (!!point) {
            var num = index===0?0 : null|| this.coordinates.length - 1;
            this.coordinates[num] = point;
        }
    }

    _geoLineString.prototype.getType = function () {
        return 'GeoLineString';
    }

    return _geoLineString;

});