/**
*
*
*
*/

define(['PlotAlgorithm', 'Hobject', 'GeoLineString', 'Hmath', 'GeoPolygon'], function (PlotAlgorithm, Hobject, GeoLineString, Hmath, GeoPolygon) {

    var extend = Hobject.BaseFunc.extend,
      copy = Hobject.BaseFunc.copy,
      mHmath = new Hmath.h2dmath(),
      scalePoint = mHmath.scalePoint,
      distance = mHmath.distance,
      pathLength=mHmath.pathLength,
      vertex = mHmath.vertex,
      angle = mHmath.angle;

    var _cannonLine = function () {
        var args = {
            minCpt: 3,
            maxCpt: 3,
        }
        PlotAlgorithm.call(this, args);
        this._inilization();
    }

    extend(_cannonLine, PlotAlgorithm);

    _cannonLine.prototype._inilization = function () {
        this.p1 = null;
        this.p2 = null;
        this.p3 = null;
        this.line1 = new GeoLineString();
    }

    _cannonLine.prototype.createGeometrys = function (movePoint) {
        var controlPoints = this._plotElement.controlPoints,
            count = controlPoints.length;
        if (count === 1) {
            this.line1.addPoint(controlPoints[0]);
            this.line1.addPoint(movePoint);
            this._plotElement.shapes[0] = this.line1;
        } else if (count === 2) {
            this.line1.replacePoint(controlPoints[1]);
            this.p1 = copy(controlPoints[0]);
            this.p2 = copy(controlPoints[1]);
            this.p3 = movePoint;
            this.getGraphParts(1);
        } else if (count === 3) {
            this.p1 = copy(controlPoints[0]);
            this.p2 = copy(controlPoints[1]);
            this.p3 = copy(controlPoints[2]);
            this.getGraphParts(1);
        }
    }

    _cannonLine.prototype.getGraphParts = function (ratio) {
        var m1, m2, m3, m4, m5, m6, m7, m8,
            p = [];
        p[0] = (this.p1[0] + this.p2[0] + this.p3[0]) / 3;
        p[1] = (this.p1[1] + this.p2[1] + this.p3[1]) / 3;
        //
        var total = pathLength([this.p1, this.p2, this.p3]) * 0.2.ratio;
        //中间横线计算
        m1[0] = p[0] - 0.5 * total;
        m1[1] = p[1];
        m2[0] = p[0] + 0.5 * total;
        m2[1] = p[1];
        var pc1 = [m1, m2];
        //下横线
        m3[0] = p[0] - 0.25 * total;
        m3[1] = p[1] - 0.1 * total;
        m4[0] = p[0] + 0.25 * total;
        m4[1] = p[1] - 0.1 * total;
        var pc2 = [m3, m4];
        //上横线
        m5[0] = p[0] - 0.25 * total;
        m5[1] = p[1] + 0.1 * total;
        m6[0] = p[0] + 0.25 * total;
        m6[1] = p[1] + 0.1 * total;
        var pc3 = [m5, m6];
        //中间横线上的竖线
        m7[0] = p[0] + 0.5 * total;
        m7[1] = p[1] - 0.1 * total;
        m8[0] = p[0] + 0.5 * total;
        m8[1] = p[1] + 0.1 * total;
        //
        var pc4 = [m7, m8];
    }

    return _cannonLine;

});