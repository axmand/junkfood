/**
*   几何对象 Polygon 类型  
*   @class Hmap.Geometry.GeoPolygon
*/
define(['GeoGeometry', 'Bound', 'Hobject'], function (GeoGeometry, Bound, Hobject) {
    //方法导入
    var extend = Hobject.BaseFunc.extend;
    /*
    *   geometry 下的 polygon 类型
    *   @class Polygon
    *   @param args {Object}
    *   {
    *       coordinates {Array}
    *       projection {Object}
    *       coordinates:    //坐标集合
    *   }
    */
    var _geoPolygon = function (args) {
        GeoGeometry.call(this, args);
        this.area = null;
    }
    //继承GeoGeometry
    extend(_geoPolygon, GeoGeometry);
    /**
    *    从geojson的geometry里创建 polygon （geometry）对象
    *   @method fromGeometry
    */
    _geoPolygon.fromGeoGeometry = function (geoGeometry) {
        return new _geoPolygon({
            coordinates: geoGeometry.coordinates,
        });
    }

    _geoPolygon.fromEsriGeometry = function (esriGeometry) {
        return new _geoPolygon({
            coordinates: esriGeometry,
        });
    }

    _geoPolygon.fromCoordinates = function (coordinates) {
        return new _geoPolygon({
            coordinates: coordinates,
        });
    }

    /**
     * 覆写bound生成算法
     */
    _geoPolygon.prototype._iniBound = function () {
        var len = this.coordinates.length, i, j, len2, coord;
        var top, left, bottom, right,
            sumLog = 0, sumLat = 0, sumLength = 0;
        for (i = 0; i < len; i++) {
            coord = this.coordinates[i];
            len2 = coord.length;
            sumLength += len2;
            for (j = 0; j < len2; j++) {
                //log,lat顺序，经度（左右）和纬度（）上下
                var log = coord[j][0], lat = coord[j][1];
                sumLog += log;
                sumLat += lat;  //计算重心用
                if (!top) {
                    left = right = log;
                    top = bottom = lat;
                }
                else {
                    top = top > lat ? top : lat;
                    bottom = bottom < lat ? bottom : lat;
                    left = left < log ? left : log;
                    right = right > log ? right : log;
                }
            }
        }
        return new Bound(top, left, bottom, right);
    }

    //用重心作为近似中心，对象为loglat
    _geoPolygon.prototype._iniCenter = function () {

    }

    /**
    *   计算polygon面积
    *   根据geometry采用的投影方式计算
    *   @method geoArea
    */
    _geoPolygon.prototype.geoArea = function () {
        if (!!this.area) return this.area;
        //1.拆分成外包多边形和洞岛结合体，GeoJson规定第一个数组集合是最大外包多边形
        var len = this.coordinates.length,
            mainArea, islandArea, i;
        var coord = this.coordinates[0];
        //2.海伦公式计算面积
        mainArea = this._calcuteArea(coord);
        //3.减去洞和岛的面积，得到实际多边形面积
        for (i = 1; i < len; i++) {
            islandArea = this._calcuteArea(this.coordinates[i]);
            mainArea -= islandArea;
        }
        return mainArea;
    }

    //计算coord多边形面积，采用海伦公式
    _geoPolygon.prototype._calcuteArea = function (coord) {
        var len = coord.length, area = 0, num2, point, point2;
        //点数目超过三个
        if (!!coord && len > 3) {
            num2 = 0;
            while (!point && num2 < len) {
                point = coord[num2++];
            }
            if (!!point) {
                if (!point2 && len > num2) {
                    point2 = coord[--len];
                }
                if (point2 != null) {
                    var num4 = (point2[0] * point[1]) - (point[0] * point2[1]);
                    while (num2 <= len) {
                        point2 = coord[num2];
                        num4 += (point2[0] * point[1]) - (point[0] * point2[1]);
                        point = point2;
                        num2++;
                    }
                    area += num4;
                }
            }
        }
        //
        return Math.abs(area / 2);
    }

    /**
    *   添加点/点数组到GeoPolygon coordinates内
    *   @method addPoint
    */
    _geoPolygon.prototype.addPoint = function (point) {
        var _point = point.dim() > 1 ? point : [point];
        if (this.coordinates.dim() === 0) { //初始化 只有一层
            this.coordinates.push(_point);
        } else if (this.coordinates.dim() === 3) {
            this.coordinates[0] = this.coordinates[0].concat(_point);
        }
    }

    _geoPolygon.prototype.getType = function () {
        return "GeoPolygon";
    }

    return _geoPolygon;

});