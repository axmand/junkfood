define(['Utils', 'Container', 'Factory', 'Canvas', 'Node'],
    function (Utils, Container, Factory, Canvas, Node) {

    var addMethods = Utils.self.addMethods,
        factory = Factory.self,
        sceneCanvas = Canvas.SceneCanvas,
        hitCanvas = Canvas.HitCanvas,
        container = Container.self,
        shapes=Utils.self.shapes,
        rgbToHex = Utils.self._rgbToHex,
        Node = Node.self,
        isInDocument = Utils.self._isInDocument,
        extend = Utils.self.extend;

    var HASH = '#',
    BEFORE_DRAW = 'beforeDraw',
    DRAW = 'draw',

    /*
     * 2 - 3 - 4
     * |       |
     * 1 - 0   5
     *         |
     * 8 - 7 - 6     
     */
    INTERSECTION_OFFSETS = [
        { x: 0, y: 0 }, // 0
        { x: -1, y: 0 }, // 1
        { x: -1, y: -1 }, // 2
        { x: 0, y: -1 }, // 3
        { x: 1, y: -1 }, // 4
        { x: 1, y: 0 }, // 5
        { x: 1, y: 1 }, // 6
        { x: 0, y: 1 }, // 7
        { x: -1, y: 1 }  // 8
    ],
    INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;

    var _layer = function (config) {
        this.___init(config);
    }

    addMethods(_layer, {
        ___init: function (config) {
            this.nodeType = 'Layer';
            this.canvas = new sceneCanvas(config);
            this.hitCanvas = new hitCanvas(config);
            // call super constructor
            container.call(this, config);
        },

        setCanvasXY: function (x, y) {
            //设置attribute
            this.setX(x);
            this.setY(y);
            //设置绘图层位置
            this.canvas.setCanvasX(x);
            this.canvas.setCanvasY(y);
            //设置hit层位置
            this.hitCanvas.setCanvasX(x);
            this.hitCanvas.setCanvasY(y);
        },
        setWH: function (width,height) {
            this.canvas.setWidth(width);
            this.hitCanvas.setWidth(width);
            this.canvas.setHeight(height);
            this.hitCanvas.setHeight(height);
        },
        _validateAdd: function (child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to a layer.');
            }
        },
        getIntersection: function (pos) {
            var obj, i, intersectionOffset, shape;

            if (this.isVisible()) {
                for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                    intersectionOffset = INTERSECTION_OFFSETS[i];
                    obj = this._getIntersection({
                        x: pos.x + intersectionOffset.x,
                        y: pos.y + intersectionOffset.y
                    });
                    shape = obj.shape;
                    if (shape) {
                        return shape;
                    }
                    else if (!obj.antialiased) {
                        return null;
                    }
                }
            }
            else {
                return null;
            }
        },
        _getIntersection: function (pos) {
            var p = this.hitCanvas.context._context.getImageData(pos.x, pos.y, 1, 1).data,
                p3 = p[3],
                colorKey, shape;

            // fully opaque pixel
            if (p3 === 255) {
                colorKey = rgbToHex(p[0], p[1], p[2]);
                shape = shapes[HASH + colorKey];
                return {
                    shape: shape
                };
            }
                // antialiased pixel
            else if (p3 > 0) {
                return {
                    antialiased: true
                };
            }
                // empty pixel
            else {
                return {};
            }
        },
        drawScene: function (canvas) {
            canvas = canvas || this.getCanvas();

            this._fire(BEFORE_DRAW, {
                node: this
            });

            if (this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }

            container.prototype.drawScene.call(this, canvas);

            this._fire(DRAW, {
                node: this
            });

            return this;
        },
        drawHit: function () {
            var layer = this.getLayer();

            if (layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().getContext().clear();
            }

            container.prototype.drawHit.call(this);
            return this;
        },
        getCanvas: function () {
            return this.canvas;
        },
        getHitCanvas: function () {
            return this.hitCanvas;
        },
        getContext: function () {
            return this.getCanvas().getContext();
        },
        clear: function (bounds) {
            var context = this.getContext(),
                hitContext = this.getHitCanvas().getContext();
            context.clear(bounds);
            hitContext.clear(bounds);
            return this;
        },
        setVisible: function (visible) {
            Node.prototype.setVisible.call(this, visible);
            if (visible) {
                this.getCanvas()._canvas.style.display = 'block';
                this.hitCanvas._canvas.style.display = 'block';
            }
            else {
                this.getCanvas()._canvas.style.display = 'none';
                this.hitCanvas._canvas.style.display = 'none';
            }
            return this;
        },
        setZIndex: function (index) {
            Kinetic.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if (stage) {
                stage.content.removeChild(this.getCanvas()._canvas);

                if (index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[index + 1].getCanvas()._canvas);
                }
                else {
                    stage.content.appendChild(this.getCanvas()._canvas);
                }
            }
            return this;
        },
        moveToTop: function () {
            Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if (stage) {
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        },
        moveUp: function () {
            if (Kinetic.Node.prototype.moveUp.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    stage.content.removeChild(this.getCanvas()._canvas);

                    if (this.index < stage.getChildren().length - 1) {
                        stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[this.index + 1].getCanvas()._canvas);
                    }
                    else {
                        stage.content.appendChild(this.getCanvas()._canvas);
                    }
                }
            }
        },
        moveDown: function () {
            if (Kinetic.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
                }
            }
        },
        moveToBottom: function () {
            if (Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
                }
            }
        },
        getLayer: function () {
            return this;
        },
        remove: function () {
            var stage = this.getStage(),
                canvas = this.getCanvas(),
                _canvas = canvas._canvas;
            Node.prototype.remove.call(this);
            if (stage && _canvas && isInDocument(_canvas)) {
                stage.content.removeChild(_canvas);
            }
            return this;
        },
        getStage: function () {
            return this.parent;
        }
    });

    extend(_layer, container);

    factory.addGetterSetter(_layer, 'clearBeforeDraw', function () {return true;});

    return {
        self:_layer,
    }
});