/**
*   几何体，空类型，包括地理信息系统常见的图像，如：
*   point,mutipoint,polygon,line,polyline等
*   @class Hmap.Geometry.Geometry
*   @author:yellow date:2013/12/4
*/
define(['epsg3857'], function (epsg3857) {
    /**
    *   矢量几何体
    *   dimension {Int} 输入2 或 3 表示二维和三维的几何体
    *   @class geometry
    */
    var _geoGeometry = function (args) {
        var _args = args || {};
        //默认为二维
        this.dimension = _args.dimension || 2;    
        //投影算法
        this.projection = _args.projection || epsg3857;
        //原始坐标记录
        this.coordinates = _args.coordinates || [];
        //投影编号
        this.proNum = this.projection.getType();
        //绘制后的element和coordinate对应序号
        this.geoElements = {};
        //用于绘制的坐标系
        this.drawCoordinates = [];
        //初始化bound,center等信息
        this._inilization();
    }

    /**
    *   判断点和polygon的关系
    *   @method pnpoly
    */
    _geoGeometry.prototype.pnpoly = function () {

    }

    //初始化Geometry，按需覆写
    _geoGeometry.prototype._inilization = function () {
        this.bound = this._iniBound();
        this.center = this._iniCenter();
    }

    /**
    *   计算geometry中心
    */
    _geoGeometry.prototype._iniCenter = function () {

    }

    /**
     * 计算geometry的boundary
     *  @method _iniBound
     * 需要子类geometry覆写
     * geometry自带bound属性，根据继承的属性给予不同的方法判断bound，无需额外判断
     */
    _geoGeometry.prototype._iniBound= function () {

    }

    /**
    *   计算lineString的长度
    *   @method geoLength
    */
    _geoGeometry.prototype.geoLength = function () {

    }

    /**
    *   计算地理polygon对象的面积
    *   @method geoArea
    */
    _geoGeometry.prototype.geoArea = function () {

    }

    /**
    *   从geojson的geometry对象中创建geometry
    *   @method formGeoGeometry
    *   @param geometry {Object}
    */
    _geoGeometry.fromGeometry = function (geometry) {

    }

    /**
    *   从geometry生成geoGeometry对象
    *   @method fromEsriGeometry
    *   @param esriGeometry {Object} 
    */
    _geoGeometry.fromEsriGeometry = function (esriGeometry) {

    }

    /**
    *   从坐标数组生成GeoGeometry
    *   @method fromCoord
    *   @param Coord {Array}
    */
    _geoGeometry.fromCoord = function (coord) {

    }

    /**
    *   直接从坐标数组生成geometry
    *   @method fromCoordinates
    *   @param coordinates {Array}
    */
    _geoGeometry.fromCoordinates = function (coordinates) {

    }

    /**
    *   添加点到coordinates
    *   @method addPoint
    *   @param point {Array} [x,y]
    */
    _geoGeometry.prototype.addPoint = function (point) {

    }

    /**
    *   替换指定位置的点
    *   @mthod replacePoint
    *   @param point {Array} [x,y]
    *   @param index {Number} 数组位置，不指定默认为数组最后一个值
    */
    _geoGeometry.prototype.replacePoint = function (point,index) {

    }

    /**
    *   获取geometry类型
    *   @return  typeName {String}
    *   @method getType
    */
    _geoGeometry.prototype.getType = function () {
        return "GeoGeometry";
    }

    return _geoGeometry;

});