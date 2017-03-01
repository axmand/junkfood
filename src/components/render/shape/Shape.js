
define(['Utils', 'Node', 'Factory'], function (Utils, Node, Factory) {
    //#region 
    var HAS_SHADOW = 'hasShadow';
    function _fillFunc(context) {
        context.fill();
    }
    function _strokeFunc(context) {
        context.stroke();
    }
    function _fillFuncHit(context) {
        context.fill();
    }
    function _strokeFuncHit(context) {
        context.stroke();
    }
    function _clearHasShadowCache() {
        this._clearCache(HAS_SHADOW);
    }
    //#endregion
    //本地类型导入，将类型赋值给对象的prototype
    var addMethods = Utils.self.addMethods,
        extend = Utils.self.extend,
        factory = Factory.self,
        getRandomColor = Utils.self.getRandomColor,
        Shapes=Utils.self.shapes,
        node = Node.self;

    var _shape = function (config) {
        this.__init(config);
    }

    addMethods(_shape, {
        __init: function (config) {
            this.nodeType = 'Shape';
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFuncHit;
            this._strokeFuncHit = _strokeFuncHit;
            var shapes = Shapes;
            var key;
            while (true) {
                key = getRandomColor();
                if (key && !(key in shapes)) {
                    break;
                }
            }
            this.colorKey = key;
            shapes[key] = this;
            node.call(this, config);
            this._setDrawFuncs();  //常规重绘
            this.on('shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic shadowEnabledChanged.kinetic', _clearHasShadowCache);
        },
        hasChildren: function () {
            return false;
        },
        getChildren: function () {
            return [];
        },
        getContext: function () {
            return this.getLayer().getContext();
        },
        getCanvas: function () {
            return this.getLayer().getCanvas();
        },
        hasShadow: function () {
            return this._getCache(HAS_SHADOW, this._hasShadow);
        },
        _hasShadow: function () {
            return this.getShadowEnabled() && (this.getShadowOpacity() !== 0 && !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY()));
        },
        hasFill: function () {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops());
        },
        hasStroke: function () {
            return !!(this.getStroke() || this.getStrokeWidth());
        },
        _get: function (selector) {
            return this.className === selector || this.nodeType === selector ? [this] : [];
        },
        intersects: function (pos) {
            var stage = this.getStage(),
                bufferHitCanvas = stage.bufferHitCanvas,
                p;
            //重绘的方式判断是否与pos相交
            bufferHitCanvas.getContext().clear();
            this.drawScene(bufferHitCanvas);
            p = bufferHitCanvas.context.getImageData(pos.x | 0, pos.y | 0, 1, 1).data;
            return p[3] > 0;
        },
        enableFill: function () {
            this._setAttr('fillEnabled', true);
            return this;
        },
        disableFill: function () {
            this._setAttr('fillEnabled', false);
            return this;
        },
        enableStroke: function () {
            this._setAttr('strokeEnabled', true);
            return this;
        },
        disableStroke: function () {
            this._setAttr('strokeEnabled', false);
            return this;
        },
        enableStrokeScale: function () {
            this._setAttr('strokeScaleEnabled', true);
            return this;
        },
        disableStrokeScale: function () {
            this._setAttr('strokeScaleEnabled', false);
            return this;
        },
        enableShadow: function () {
            this._setAttr('shadowEnabled', true);
            return this;
        },
        disableShadow: function () {
            this._setAttr('shadowEnabled', false);
            return this;
        },
        enableDashArray: function () {
            this._setAttr('dashArrayEnabled', true);
            return this;
        },
        disableDashArray: function () {
            this._setAttr('dashArrayEnabled', false);
            return this;
        },
        destroy: function () {
            node.prototype.destroy.call(this);
            delete Shapes[this.colorKey];
            return this;
        },
        //}{ chorme里，不使用buffer canvas会提高绘图效率，
        // 解决方法，将buffer canvas 改为 256*256大小,与瓦片区域大小一致即可高效绘图
        _useBufferCanvas: function () {
            //return false;
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasFill() && this.hasStroke();
        },
        drawScene: function (can) {
            var canvas = can || this.getLayer().getCanvas(),
                context = canvas.getContext(),
                drawFunc = this.getDrawFunc(),
                hasShadow = this.hasShadow(),
                stage, bufferCanvas, bufferContext;

            if (drawFunc && this.isVisible()) {
                // if buffer canvas is needed
                if (this._useBufferCanvas()) {
                    stage = this.getStage();
                    if (!stage) return;
                    bufferCanvas = stage.bufferCanvas;
                    bufferContext = bufferCanvas.getContext();
                    bufferContext.clear();
                    bufferContext.save();
                    bufferContext._applyLineJoin(this);
                    bufferContext._applyAncestorTransforms(this);
                    drawFunc.call(this, bufferContext);
                    bufferContext.restore();
                    context.save();
                    if (hasShadow) {
                        context.save();
                        context._applyShadow(this);
                        context.drawImage(bufferCanvas._canvas, 0, 0);
                        context.restore();
                    }
                    context._applyOpacity(this);
                    context.drawImage(bufferCanvas._canvas, 0, 0);
                    context.restore();
                }
                    // if buffer canvas is not needed
                else {
                    context.save();
                    context._applyLineJoin(this);
                    context._applyAncestorTransforms(this);

                    if (hasShadow) {
                        context.save();
                        context._applyShadow(this);
                        drawFunc.call(this, context);
                        context.restore();
                    }
                    
                    context._applyOpacity(this);
                    drawFunc.call(this, context);
                    context.restore();
                }
            }

            return this;
        },
        /**
         * hitTest
         */
        drawHit: function () {
            var attrs = this.getAttrs(),
                drawFunc = attrs.drawHitFunc || attrs.drawFunc,
                canvas = this.getLayer().hitCanvas,
                context = canvas.getContext();

            if (drawFunc && this.shouldDrawHit()) {
                context.save();
                context._applyLineJoin(this);
                context._applyAncestorTransforms(this);
                drawFunc.call(this, context);
                context.restore();
            }
            return this;
        },
        //设置绘制方法
        _setDrawFuncs: function () {
            if (!this.attrs.drawFunc && this.drawFunc) {
                this.setDrawFunc(this.drawFunc);
            }
            if (!this.attrs.drawHitFunc && this.drawHitFunc) {
                this.setDrawHitFunc(this.drawHitFunc);
            }
        }
    });

    extend(_shape, node);

    factory.addColorGetterSetter(_shape, 'stroke');
    factory.addGetterSetter(_shape, 'lineJoin');
    factory.addGetterSetter(_shape, 'lineCap');
    factory.addGetterSetter(_shape, 'strokeWidth');
    factory.addGetterSetter(_shape, 'drawFunc');    //原版场景重绘
    factory.addGetterSetter(_shape, 'drawHitFunc'); //原版hit场景重绘
    factory.addGetterSetter(_shape, 'dashArray');
    factory.addColorGetterSetter(_shape, 'shadowColor');
    factory.addGetterSetter(_shape, 'shadowBlur');
    factory.addGetterSetter(_shape, 'shadowOpacity');
    factory.addPointGetterSetter(_shape, 'shadowOffset', 0);
    factory.addGetterSetter(_shape, 'fillPatternImage');
    factory.addColorGetterSetter(_shape, 'fill');
    factory.addGetterSetter(_shape, 'fillPatternX', 0);
    factory.addGetterSetter(_shape, 'fillPatternY', 0);
    factory.addGetterSetter(_shape, 'fillLinearGradientColorStops');
    factory.addGetterSetter(_shape, 'fillRadialGradientStartRadius', 0);
    factory.addGetterSetter(_shape, 'fillRadialGradientEndRadius', 0);
    factory.addGetterSetter(_shape, 'fillRadialGradientColorStops');
    factory.addGetterSetter(_shape, 'fillPatternRepeat');
    factory.addGetterSetter(_shape, 'fillEnabled', true);
    factory.addGetterSetter(_shape, 'strokeEnabled', true);
    factory.addGetterSetter(_shape, 'shadowEnabled', true);
    factory.addGetterSetter(_shape, 'dashArrayEnabled', true);
    factory.addGetterSetter(_shape, 'strokeScaleEnabled', true);
    factory.addGetterSetter(_shape, 'fillPriority', 'color');
    factory.addPointGetterSetter(_shape, 'fillPatternOffset', 0);
    factory.addPointGetterSetter(_shape, 'fillPatternScale', 1);
    factory.addPointGetterSetter(_shape, 'fillLinearGradientStartPoint', 0);
    factory.addPointGetterSetter(_shape, 'fillLinearGradientEndPoint', 0);
    factory.addPointGetterSetter(_shape, 'fillRadialGradientStartPoint', 0);
    factory.addPointGetterSetter(_shape, 'fillRadialGradientEndPoint', 0);
    factory.addRotationGetterSetter(_shape, 'fillPatternRotation', 0);

    return {
        self:_shape,
    }

});