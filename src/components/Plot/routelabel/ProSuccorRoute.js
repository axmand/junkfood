/**
*   专业救援
*   @class Hmap.Plot.Routelabel.ProSuccorRoute
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

    var _proSuccorRoute = function () {
        BaseRoute.call(this);
    }

    extend(_proSuccorRoute, BaseRoute);

    _proSuccorRoute.prototype.signal = function (H, rectLDown, rectRDown, rectLUp, rectRUp) {
        var line2 = scalePoint(rectLDown, rectRDown, 0.3),
        line8 = scalePoint(rectLDown, rectRDown, 0.7),

        l1 = vertex(rectLDown, this.points[0], this.points[0], 1.6 * H, false),
        l2 = vertex(rectLDown, line2, line2, H, false),
        l3 = vertex(rectLDown, line8, line8,H, false),
        l4 = vertex(rectLDown, this.points[0], this.points[0], 0.4 * H, false);

        var path3 = [l1,l2,l4,l3,l1];   
        this.triangle.coordinates = [path3];
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle;
    }

    return _proSuccorRoute;

});