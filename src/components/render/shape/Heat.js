/**
*   热力图绘制
*   使用canvas元素标签将所有点绘制到画布上，每个点给予较低的透明度。
*   然后获取画布每个点的位数据，根据其alpha值(alpha ∈ [0, 255])
*   的大小计算每一位的r，g，b的值，得出所有新的位数据之后，重新绘制。
*   使之呈现为红色↔蓝色渐变。
*   
*/

define(['Shape', 'Utils', 'Factory'], function (Shape, Utils, Factory) {

    var Shape = Shape.self,
        Factory = Factory.self,
        extend = Utils.self.extend;
    
    //缓存器
    var store = function (heat) {
        var _ = {
            data: [],  //二维数组，
            heatmap: heat,
            //属性设置
            radius: 40,
            element: {},
            canvas: {},
            acanvas: {},
            ctx: {},
            actx: {},
            legend: null,
            visible: true,
            width: 256,
            height: 256,
            max: 1,
            gradient: false,
            opacity: 180,
            premultiplyAlpha: false,
            debug: false,
        };
        this.get = function (key) {
            return _[key];
        }
        this.set = function (key, value) {
            _[key] = value;
        }
    }
    
    store.prototype = {
        setDataSet: function () {

        }
    }

    var _heat = function (config) {
        this.___init(config);
    }

    _heat.prototype = {

        ___init: function (config) {
            Shape.call(this, config);
            this.store = new store(this); //存储store
            this.config = null;
        },

        _configure:function(config){
            var me = this.store;
            me.set('radius', config['radius'] || 40);
            me.set('element',(config.element instanceof Object)?
                config.element:document.getElementById(config.element));
            me.set("visible", (config.visible != null) ? config.visible : true);
            me.set("max", config.max || 1);
            me.set("gradient", config.gradient || { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)" });    
            me.set("opacity", parseInt(255 / (100 / config.opacity), 10) || 180);
            me.set("width", config.canvas.width || 256);
            me.set("height", config.canvas.height || 256);
            me.set("debug", config.debug || true);
            return config;
        },
        /**
         * alpha绘制
         */
        drawAlpha: function (x, y, count, colorize) {
            var me = this.store,
                radius = me.get('radius'),
                mRaidus = 1.5 * radius,
                ctx = me.get('context'),
                max = me.get('max'),
                xb = x - (mRaidus) >> 0,
                yb = y - (mRaidus) >> 0,
                xc = x + (mRaidus) >> 0,
                yc = y + (mRaidus) >> 0;
            //
            ctx._context.shadowColor = ('rgba(0,0,0,' + ((count) ? (count / me.get('max')) : '0.1') + ')');
            ctx._context.shadowOffsetX = 15000;
            ctx._context.shadowOffsetY = 15000;
            ctx._context.shadowBlur = 15;
            ctx.arc(x - 15000, y - 15000, radius, 0, Math.PI * 2, true);
            //this.colorize(xb, yb);
        },
        /*
         *   设置边框线颜色
         */
        initColorPalette: function (context) {
            var me = this.store,
                ctx = context._context,
                gradient = me.get('gradient');

            grad = ctx.createLinearGradient(0, 0, 1, 256);
            //
            testData = ctx.getImageData(0, 0, 1, 1);
            testData.data[0] = testData.data[3] = 64; // 25% red & alpha
            testData.data[1] = testData.data[2] = 0; // 0% blue & green
            ctx.putImageData(testData, 0, 0);
            testData = ctx.getImageData(0, 0, 1, 1);
            me.set("premultiplyAlpha", (testData.data[0] < 60 || testData.data[0] > 70));

            for (var x in gradient) {
                grad.addColorStop(x, gradient[x]);
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1, 256);
            me.set("gradient", ctx.getImageData(0, 0, 1, 256).data);
            me.set('colorPalette',true);
        },

        /*
         * 为阴影着色
         */
        colorize:function(x,y){
            var me = this.store,
                width = me.get('width'),
                radius = me.get("radius"),
                height = me.get("height"),
                ctx = me.get('context'),
                actx = me.get('acontext'),
                x2 = radius * 3,
                premultiplyAlpha = me.get("premultiplyAlpha"),
                palette = me.get("gradient"),
                opacity = me.get("opacity"),
                //bounds = me.get("bounds"),
                left, top, bottom, right,
                image, imageData, length, alpha, offset, finalAlpha;
            //
            if (x != null && y != null) {
                if (x + x2 > width) {
                    x = width - x2;
                }
                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                if (y + x2 > height) {
                    y = height - x2;
                }
                left = x;
                top = y;
                right = x + x2;
                bottom = y + x2;
            } 
            image = actx.getImageData(left, top, right - left, bottom - top);
            imageData = image.data;
            length = imageData.length;
            // loop thru the area
            for (var i = 3; i < length; i += 4) {
                // [0] -> r, [1] -> g, [2] -> b, [3] -> alpha
                alpha = imageData[i],
                offset = alpha * 4;
                if (!offset)
                    continue;
                // we ve started with i=3
                // set the new r, g and b values
                finalAlpha = (alpha < opacity) ? alpha : opacity;
                imageData[i - 3] = palette[offset];
                imageData[i - 2] = palette[offset + 1];
                imageData[i - 1] = palette[offset + 2];
                if (premultiplyAlpha) {
                    // To fix browsers that premultiply incorrectly, we'll pass in a value scaled
                    // appropriately so when the multiplication happens the correct value will result.
                    imageData[i - 3] /= 255 / finalAlpha;
                    imageData[i - 2] /= 255 / finalAlpha;
                    imageData[i - 1] /= 255 / finalAlpha;
                }
                // we want the heatmap to have a gradient from transparent to the colors
                // as long as alpha is lower than the defined opacity (maximum), we'll use the alpha value
                imageData[i] = finalAlpha;
            }
            // the rgb data manipulation didn't affect the ImageData object(defined on the top)
            // after the manipulation process we have to set the manipulated data to the ImageData object
            image.data = imageData;
            ctx.putImageData(image, left, top);
        },

        /**
         * 绘制阴影
         */
        drawFunc: function (context) {
            var me = this.store;
            this.config = this.config || this._configure(context);
            !me.get('context') ? me.set('context', context) : null;
            !me.get('acontext') ? me.set('acontext', this.getContext()) : null;
            //传递过来的context绘图使用
            context.beginPath();
            var points = this.getPoints(),i,point,
                len = points.length;
            for (i = 0; i < len; i++) {
                point = points[i];
                this.drawAlpha(point.x, point.y, point.value, true);
            }
            context.closePath();
            context.fill();
        },
    }

    extend(_heat, Shape);

    Factory.addPointsGetterSetter(_heat, 'points');

    return {
        self: _heat,
    }

});
