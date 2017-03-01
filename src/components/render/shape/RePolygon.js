/**
*   @modules RePolygon
*   提供正多边形绘发，用于绘制地图常用符号
*   var hexagon=new RePolygon({
*       x:
*       y:
*       sides://正N边形
*       fill:'red'
*       stroke:
*       strokeWidth:
*   });
*/
define(['Shape', 'Utils', 'Factory', 'Collection'], function (Shape, Utils, Factory, Collection) {

    var Shape = Shape.self,
        Factory = Factory.self,
        Collection = Collection.self,
        extend = Utils.self.extend;

    var _rePolygon = function (config) {
        this.___init(config);
    }

    _rePolygon.prototype = {
        ___init: function (config) {
            Shape.call(this, config);
            this.className = "RePolygon";
        },
        drawFunc: function (context) {
            var sides = this.attrs.sides,
               radius = this.attrs.radius,
               n, x, y;
            context.beginPath();
            context.moveTo(0, 0 - radius);
            for (n = 1; n < sides; n++) {
                x = radius * Math.sin(n * 2 * Math.PI / sides);
                y = -1 * radius * Math.cos(n * 2 * Math.PI / sides);
                context.lineTo(x, y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    }

    extend(_rePolygon, Shape);
    Factory.addGetterSetter(_rePolygon, 'radius', 0);
    Factory.addGetterSetter(_rePolygon, 'sides', 0);

    return {
        self:_rePolygon,
    }

});