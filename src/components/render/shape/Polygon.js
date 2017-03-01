
define(['Shape', 'Utils', 'Factory'], function (Shape, Utils, Factory) {

    var Shape=Shape.self,
        Factory=Factory.self,
        extend = Utils.self.extend;
        

    var _polygon=function(config){
        this.___init(config);
    }

    _polygon.prototype={
        ___init:function(config){
            Shape.call(this,config);
            this.className = "Polygon";
        },
        drawFunc: function (context) {
            var points = this.getPoints(), len = points.length;
            if (len === 0) return;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (var i = 1; i<len; i++) {
                context.lineTo(points[i][0], points[i][1]);
            }
            context.closePath();
            context.fillStrokeShape(this);
        },
    }

    extend(_polygon,Shape);

    Factory.addPointsGetterSetter(_polygon,'points');

    return{
        self:_polygon,
    }

});
