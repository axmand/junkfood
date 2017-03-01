/**
*   专用绘制polt的geoElement
*   @class Hmap.Plot.PlotGeoElement
*   @param args
*   var plotElement=new PlotElement({
*       graphAlgorithm:         //必须参数
*   })
*/
define(['GeoElement','Hobject'],function (GeoElement,Hobject) {

    var extend = Hobject.BaseFunc.extend;

    var _plotGeoElement = function (args) {
        var _args = args || {};
        //图形算法
        this.graphAlgorithm = _args.graphAlgorithm;
        //包含的图形集合
        this.shapes = [];
        //控制点
        this.controlPoints = [];
        GeoElement.call(this, _args);
    }

    extend(_plotGeoElement, GeoElement);

    /**
    *   设置标绘图像算法
    *   @method setGraphAlgorithm
    */
    _plotGeoElement.prototype.setGraphAlgorithm = function (graphAlgorithm) {
        this.graphAlgorithm = graphAlgorithm;
        this.accept(this.graphAlgorithm);
    }

    /**
    *   添加控制点
    *   @method addControlPoint
    *   @param point {Array} [x,y]
    */
    _plotGeoElement.prototype.addControlPoint = function (point) {
        //小于控制点数目上限
        if (this.controlPoints.length < this.graphAlgorithm.maxCpt) this.controlPoints.push(point);
    }

    /**
    *   图像控制点位置更新重绘
    *   @method movePoint
    *   @param point {Array} [x,y]
    */
    _plotGeoElement.prototype.movePoint = function (movePoint) {
        this.graphAlgorithm.createGeometrys(movePoint);
    }

    _plotGeoElement.prototype._inilization = function () {
        this.accept(this.graphAlgorithm);
    }
    /**
    *   访问者模式，共享操作PoltElement元素
    *   @method accept
    */
    _plotGeoElement.prototype.accept = function (visit) {
        visit.visit(this);
    }

    _plotGeoElement.prototype.getType = function () {
        return 'PlotElement';
    }

    _plotGeoElement.prototype.toDrawGeoElements = function () {
        var typeName, drawGeoElements = [];
        for (var j = 0, len2 = this.shapes.length; j < len2; j++) {
            var shape = this.shapes[j];
            typeName = shape.getType();
            if (typeName === 'GeoPoint') {
                shape.drawCoordinates = [[shape.coordinates[0], shape.coordinates[1]]];
            } else if (typeName === 'GeoPolygon') {
                shape.drawCoordinates = shape.coordinates;
            } else if (typeName === 'GeoLineString') {
                shape.drawCoordinates = [shape.coordinates];
            }
            drawGeoElements.push(shape);
        }
        return drawGeoElements;
    }

    /**
    *   设置更新索引 shape 的 coord
    *   @method setShapeCoord
    *   @param 
    */
    _plotGeoElement.prototype.setShapeCoord = function (coord, index) {
        var geometory=this.shapes[index];
        if (!!geometory) {
            var typeName = geometory.getType();
            if (typeName === 'GeoLineString')
                geometory.coordinates = coord;
            else if(typeName==='GeoPolygon')
                geometory.coordinates[0] = coord;
        }
    }

    return _plotGeoElement;

});