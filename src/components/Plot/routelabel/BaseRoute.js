/**
*   routelabel算法基类，提供除了符号的标绘图形计算
*   @class Hmap.Plot.Routelabel.ArmyRoute
*/

define(['PlotAlgorithm', 'Hobject', 'GeoLineString', 'Hmath', 'GeoPolygon'], function (PlotAlgorithm, Hobject, GeoLineString, Hmath, GeoPolygon) {

    var extend = Hobject.BaseFunc.extend,
      copy = Hobject.BaseFunc.copy,
       //对象导入
      mHmath = new Hmath.h2dmath(),
      scalePoint = mHmath.scalePoint,
      distance = mHmath.distance,
      pathLength = mHmath.pathLength,
      bzLine = mHmath.bzLine,
      gainPt = mHmath.gainPt,
      vertex = mHmath.vertex,
      angle = mHmath.angle;

    var _baseRoute = function () {
        var args = {
            minCpt: 3,
            maxCpt: 3,
        }
        PlotAlgorithm.call(this, args);
        this._inilization();
    }

    extend(_baseRoute, PlotAlgorithm);

    _baseRoute.prototype._inilization = function () {
        this.points = null;
        this.pline4 = null;
        this.pline6 = null;
        this.bzpoints = null;
        this.line = new GeoLineString();
        this.triangle = new GeoLineString();
        this.rect = new GeoLineString();
        this.arrow = new GeoPolygon();
    }

    _baseRoute.prototype.createGeometrys = function (movePoint) {
        var controlPoints = this._plotElement.controlPoints,
            count = controlPoints.length;
        if (count === 1) {
            this.line.addPoint(controlPoints[0]);
            this.line.addPoint(movePoint);
            this._plotElement.shapes[0] = this.line;
        } else if(count<this.maxCpt) {
            this.points = copy(controlPoints);
            this.points.push(movePoint);
            this.bzpoints = bzLine(this.points);
            this.line.coordinates = this.bzpoints;
            this.getGraphParts(1);
        }else if(count===this.maxCpt){
            this.points = copy(controlPoints);
            this.bzpoints = bzLine(this.points);
            this.line.coordinates = this.bzpoints;
            this.getGraphParts(1);
        }
    }

    _baseRoute.prototype.getGraphParts = function (ratio) {
        var p1, p2, p3,
            pt31, line8LDown, line8LUp, line8MLeft, line8MRight,
            rectLDown, rectLUp, rectRDown, rectRUp,
            path1;
        path1 = copy(this.bzpoints);
        var dis = pathLength(this.bzpoints),
            lineHight = dis * ratio * 4 / 210;
        pt31 = gainPt(path1, dis, 1 / 31);
        p1 = copy(path1[0]);
        var H = lineHight;  //贝瑟尔曲线曲线点计算H值会造成长度变化，这里采用lineHeight
        this.pline4 = gainPt(path1, dis, 12.8 / 13);
        var pline5 = path1[path1.length - 1];
        this.pline6 = scalePoint(this.pline4, pline5, 2.5);
        //添加矩形
        rectLDown = vertex(pt31, p1, p1, H, false);
        rectRDown = vertex(pt31, p1, p1, H, true);
        rectLUp = vertex(p1, rectLDown, rectLDown, 2 * H, true);
        rectRUp = vertex(p1, rectRDown, rectRDown, 2 * H, false);
        var path2 = [rectLDown, rectLUp, rectRUp, rectRDown, rectLDown];//线状框坐标集
        this.rect.coordinates = path2;
        this._plotElement.shapes[1] = this._plotElement.shapes[1] || this.rect;
        //矩形框内部标识折线
        this.signal(H,rectLDown, rectRDown, rectLUp, rectRUp);
        //箭头
        var arrow1, arrow2, arrow3, arrow4;
        arrow1 = vertex(pline5, this.pline4, this.pline4, lineHight, true);
        arrow2 = this.pline6;
        arrow3 = vertex(pline5, this.pline4, this.pline4, lineHight, false);
        arrow4 = pline5;
        var arrow = [arrow1, arrow2, arrow3, arrow4, arrow1];
        this.arrow.coordinates = [arrow];
        this._plotElement.shapes[3] = this._plotElement.shapes[3] || this.arrow;
    }

    /**
    *   覆写Route里，标记图形算法
    *   @method singal
    *   @abstract
    */
    _baseRoute.prototype.signal = function (H,rectLDown, rectRDown, rectLUp, rectRUp) {

    }

    return _baseRoute;

});