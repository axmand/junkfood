
define(['Shape', 'Utils', 'Factory'], function (Shape, Utils, Factory) {

    var Shape = Shape.self,
        Factory = Factory.self,
        extend = Utils.self.extend;

    var colors = ["#000000", "#2892C6", "#67A7B3", "#C0D48C", "#FBB344", "#F25623"];

    var _raster = function (config) {
        this.___init(config);
    }

    _raster.prototype = {
        ___init: function (config) {
            Shape.call(this, config);
            this.className = "Raster";
        },
        drawFunc: function (context) {
            var data = this.getGraphicData(),
                //colors = this.getSymbol()||colors,
                pr = 4,
                hfPr = pr / 2,
                i, len = data.length;
            context.beginPath();
            for (i = 0; i < len; i++) {
                var ele = data[i],
                    x = ele[0],
                    y = ele[1],
                    color = colors[ele[2]];
                context.fillStyle(color);
                context.fillRect(x - hfPr, y - hfPr, pr, pr);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    }

    extend(_raster, Shape);

    //栅格数据集
    Factory.addGetterSetter(_raster, 'graphicData', {});
    //设置symbol-图例
    Factory.addGetterSetter(_raster, 'symbol', {});

    return {
        self: _raster,
    }

});
