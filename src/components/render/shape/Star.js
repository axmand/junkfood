/**
*   提供星星图标绘制法
*   @modules Star
 * var star = new Star({<br>
     *   x: 100,<br>
     *   y: 200,<br>
     *   numPoints: 5,<br>
     *   innerRadius: 70,<br>
     *   outerRadius: 70,<br>
     *   fill: 'red',<br>
     *   stroke: 'black',<br>
     *   strokeWidth: 4<br>
     * });
*/

define(['Shape', 'Utils', 'Factory', 'Collection'], function (Shape, Utils, Factory, Collection) {

    var Shape = Shape.self,
        Factory = Factory.self,
        Collection = Collection.self,
        extend = Utils.self.extend;

    var _star = function (config) {
        this.___init(config);
    }

    _star.prototype = {
        ___init: function (config) {
            Shape.call(this, config);
            this.className = 'Star';
        },

        /*
        *   绘制方法
        */
        drawFunc: function (context) {
            var innerRadius = this.attrs.innerRadius,
               outerRadius = this.attrs.outerRadius,
               numPoints = this.attrs.numPoints;

            context.beginPath();
            context.moveTo(0, 0 - outerRadius);

            for (var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin(n * Math.PI / numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
                context.lineTo(x, y);
            }

            context.closePath();
            context.fillStrokeShape(this);
        }
    }

    extend(_star, Shape);
    //默认为五角星
    Factory.addGetterSetter(_star,'numPoints',5);
    Factory.addGetterSetter(_star, 'innerRadius', 0);
    Factory.addGetterSetter(_star, 'outerRadius', 0);

    //Collection.mapMethods(_star);

    return {
        self:_star,
    }

});