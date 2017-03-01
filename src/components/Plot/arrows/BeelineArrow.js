/**
*   直细箭头标绘算法
*   @class Hmap.Plot.Arrows.BeelineArrow
*/
define(['PlotAlgorithm', 'Hobject', 'GeoLineString', 'Hmath', 'GeoPolygon'], function (PlotAlgorithm, Hobject, GeoLineString, Hmath, GeoPolygon) {

    var extend = Hobject.BaseFunc.extend,
        copy = Hobject.BaseFunc.copy,
        //对象导入
        GeoLineString = GeoLineString,
        GeoPolygon = GeoPolygon,
        //
        mHmath = new Hmath.h2dmath(),
        scalePoint=mHmath.scalePoint,
        vertex=mHmath.vertex,
        angle=mHmath.angle;

    var _beelineArrow = function () {
        //算法必要参数
        var args = {
            minCpt: 2,
            maxCpt:3,
        }
        PlotAlgorithm.call(this, args);
        //箭头
        this.arrowLine = new GeoLineString();
        this.p1 = null;
        this.p2 = null;
    }
    //
    extend(_beelineArrow, PlotAlgorithm);

    //根据plot里的控制点个数，创建geometrys
    _beelineArrow.prototype.createGeometrys = function (movePoint) {
        //访问者模式获取到plotElement
        var controlsPoints = this._plotElement.controlPoints;
        if (controlsPoints.length === 1) {  //控制点有一个的时候，则根据movePoint创建基础geometry
            if (!!this._plotElement.shapes[0]) {
                //shape 0已经存在，则修改coordinates
                this.arrowLine.replacePoint(movePoint);
            } else {
                this.arrowLine.addPoint(controlsPoints[0]);
                this.arrowLine.addPoint(movePoint);
                this._plotElement.shapes[0] = this.arrowLine;
            }
        } else if (controlsPoints.length >=2) {   //控制点完成后，move操作是用来做修改的
            this.p1 = copy(controlsPoints[0]);
            this.p2 = copy(movePoint || controlsPoints[1]);
            this.arrowLine.replacePoint(this.p1, 0);
            this.arrowLine.replacePoint(this.p2);
            this.getGraphParts(1);
        }
    }

    /**
    *   箭头算法
    */
    _beelineArrow.prototype.getGraphParts = function (ratio) {
        var distance = this.arrowLine.geoLength(),
            lineHeight = distance * ratio * 4 / 210;
            //lineHeight = distance;
        var p5 = scalePoint(this.p1, this.p2, 12.7 / 13);   //箭头颈点
        var p6 = scalePoint(p5, this.p2, 2.5);
        var arrowHead = new GeoPolygon();
        var a1 = vertex(this.p1, this.p2, p5, lineHeight * 1, true),       //40度倒角
            a2 = vertex(this.p1, this.p2, p5, lineHeight * 1, false),          //-40度倒角
            a3 = p6,
            a4 = this.p2;
        //箭头绘制完毕
        arrowHead.addPoint([a1, a3, a2, a4, a1]);
        this._plotElement.shapes[1] = arrowHead;
    }

    return _beelineArrow;
    
});