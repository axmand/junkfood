/**
*   直箭头
*   @class Hmap.Plot.Arrows.SlightnessArrow
*/

define(['PlotAlgorithm', 'Hobject', 'GeoLineString', 'Hmath', 'GeoPolygon'], function (PlotAlgorithm, Hobject, GeoLineString, Hmath, GeoPolygon){

    var extend = Hobject.BaseFunc.extend,
       copy = Hobject.BaseFunc.copy,
       //
       mHmath = new Hmath.h2dmath(),
       scalePoint = mHmath.scalePoint,
       distance=mHmath.distance,
       vertex = mHmath.vertex,
       angle = mHmath.angle;

    var _slightnessArrow = function () {
        var args = {
            minCpt: 2,
            maxCpt: 2,
        }
        PlotAlgorithm.call(this, args);
        this.arrowPolygon=new GeoPolygon();
        this._inilization();
    }

    extend(_slightnessArrow, PlotAlgorithm);

    _slightnessArrow.prototype._inilization = function () {
        this.p1 = null;
        this.p2 = null;
    }
   
    _slightnessArrow.prototype.createGeometrys = function (movePoint) {
        var controlsPoints = this._plotElement.controlPoints,
            count = controlsPoints.length;
        if (count === 1) {
            this.p1 = controlsPoints[0];
            this.p2 = movePoint;
            this.getGraphParts(1);
        } else if (count === 2) {
            this.p1 = controlsPoints[0];
            this.p2 = controlsPoints[1];
            this.getGraphParts(1);
        }
    }

    _slightnessArrow.prototype.getGraphParts = function (ratio) {
        var dis = distance(this.p1, this.p2),
            lineHight = dis * ratio;
        var gmi1 = scalePoint(this.p1, this.p2, 0.83),
            gmi2 = scalePoint(this.p1, this.p2, 0.9),
            //
            arrow1 = vertex(this.p1, this.p2, this.p1, lineHight / 8, true),
            arrow7 = vertex(this.p1, this.p2, this.p1, lineHight / 8, false),
            //
            arrow2 = vertex(this.p1, this.p2, gmi1, lineHight / 15, true),
            arrow6 = vertex(this.p1, this.p2, gmi1, lineHight / 15, false),
            //
            arrow3 = vertex(this.p1, this.p2, gmi2, lineHight / 65, true),
            arrow5 = vertex(this.p1, this.p2, gmi2, lineHight / 65, false),
            //
            arrow4 = this.p2;
        var points = [arrow1, arrow3, arrow2, arrow4, arrow6, arrow5, arrow7, arrow1];
        this.arrowPolygon.coordinates = [points];
        this._plotElement.shapes[0] = this._plotElement.shapes[0] || this.arrowPolygon;
    }

    return _slightnessArrow;

});