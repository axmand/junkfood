/**
*
*   单曲箭头
*   @class Hmap.Plot.Arrows.CurveArrow
*/

define(['PlotAlgorithm', 'Hobject', 'Hmath', 'GeoLineString', 'GeoPolygon'], function (PlotAlgorithm, Hobject, Hmath, GeoLineString, GeoPolygon) {

    var mH2dmath = Hmath.mH2dmath,
        extend = Hobject.BaseFunc.extend,
        copy=Hobject.BaseFunc.copy,
        bzLine = mH2dmath.bzLine,
        scalePoint=mH2dmath.scalePoint,
        vertex=mH2dmath.vertex,
        gainPt = mH2dmath.gainPt,   //求曲线上点和其索引位置
        pathLength=mH2dmath.pathLength;

    var _curveArrow = function () {
        //最多可以添加十个控制点绘制贝瑟尔曲线
        var args = {
            minCpt:2,
            maxCpt: 5,
        }
        PlotAlgorithm.call(this, args);
        //箭头柄线
        this.arrowLine = new GeoLineString();
        this.arrowPolygon = new GeoPolygon();
        //
        this._inilization();
    }

    extend(_curveArrow, PlotAlgorithm);

    _curveArrow.prototype._inilization = function () {
        this.bzPoints = null;
    }

    _curveArrow.prototype.createGeometrys = function (movePoint) {
        var controlsPoints = this._plotElement.controlPoints,
            len = controlsPoints.length;
        if (controlsPoints.length === 1) {  //一个控制点，绘制直线
            if (!!this._plotElement.shapes[0]) {
                this.arrowLine.replacePoint(movePoint);
            } else {
                this.arrowLine.addPoint(controlsPoints[0]);
                this.arrowLine.addPoint(movePoint);
                this._plotElement.shapes[0] = this.arrowLine;
            }
        } else if (len <this.maxCpt) {    //使用控制点计算贝瑟尔曲线
            var ctps = copy(controlsPoints);
            ctps.push(movePoint);
            //计算贝瑟尔曲线
            var bezierPoints = bzLine(ctps);
            this.arrowLine.coordinates = this.bzPoints=bezierPoints;
            //计算箭头位置
            this.getGraphParts(1);
        } else if (len === this.maxCpt) {
            var ctps = copy(controlsPoints);
            //计算贝瑟尔曲线
            var bezierPoints = bzLine(ctps);
            this.arrowLine.coordinates = this.bzPoints = bezierPoints;
            //计算箭头位置
            this.getGraphParts(1);
        }
    }

    _curveArrow.prototype.getGraphParts = function (ratio) {
        var pt5 = [], pt6 = [],
            index5, //曲线上 12.3/13上的点的索引
            index6,
            arrow1, arrow2, arrow3, arrow4;
        var distance = pathLength(this.bzPoints),
            lineHeight = distance * ratio * 4 / 210;
        //添加箭头
        pt5 = gainPt(this.bzPoints, distance, 12.7/ 13, index5);
        pt6 = gainPt(this.bzPoints, distance, 12.3 / 13 * 1.0205, index6);
        var pline5 = copy(this.bzPoints[this.bzPoints.length - 1]);
        pt6 = scalePoint(pt5, pline5, 2.5);
        //
        arrow1 = vertex(pline5, pt5, pt5, lineHeight, true);
        arrow2 = vertex(pline5, pt5, pt5, lineHeight, false);
        arrow3 = pt6;
        arrow4 = pline5;
        //
        var coords = [arrow1, arrow3, arrow2, arrow4, arrow1];
        //
        this.arrowPolygon.coordinates=[coords];
        this._plotElement.shapes[1] = this._plotElement.shapes[1] || this.arrowPolygon;
        
    }

    return _curveArrow;

});