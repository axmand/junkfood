/**
*   行军路线
*   @class Hmap.Plot.Routelabel.ArmyRoute
*/

define(['BaseRoute', 'Hobject', 'GeoLineString', 'Hmath', 'GeoPolygon'], function (BaseRoute, Hobject, GeoLineString, Hmath, GeoPolygon) {

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

    var _armyRoute = function () {
        BaseRoute.call(this);
    }

    extend(_armyRoute, BaseRoute);

    _armyRoute.prototype.signal = function (H,rectLDown, rectRDown, rectLUp, rectRUp) {
        var line2 = scalePoint(rectLDown, rectRDown, 0.2),
        line8 = scalePoint(rectLDown, rectRDown, 0.8),
        l1 = vertex(rectLDown, line2, line2, 1.6 * H, false),   //三角形三个顶点
        l2 = vertex(rectLDown, line2, line2, 0.6 * H, false),
        l3 = vertex(rectLDown, line8, line8, H, false);
        var path3 = [l1, l2, l3, l1];   //三角形坐标集
        this.triangle.coordinates = path3;
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle;
    }

    return _armyRoute;

});